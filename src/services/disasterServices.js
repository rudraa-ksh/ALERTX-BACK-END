import axios from "axios";
import {geohashQueryBounds, distanceBetween} from 'geofire-common';
import {db} from "../config/Connection.js"
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { fetchDisaster, fetchDisasters, setDisaster } from "../repositories/disaster.js";
import { getUser, changeUserStatus } from "../repositories/user.js";

dotenv.config()
let no = 1;

async function getActiveDisasters() {
    try {
        const response = await axios.get(process.env.mockapi);
        return response.data.disasters;
    } catch (error) {
        throw new Error(`Error fetching active disasters: ${error}`);
    }
}

async function getCurrentDisasters(){
    try {
        const snapshot = await fetchDisasters();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error(`Error fetching current disasters: ${error}`);
    }
}

async function addAllActiveDisasters(active) {
    try {
        const disastersWithPrecautions = await Promise.all(
            active.map(async (disaster) => {
                const response = await generatePrecautions(disaster.type);
                const desc = await generateDescription(disaster.type);
                const intro = await generateIntroduction(disaster.type);
                return {
                    ...disaster,
                    precautions: response,
                    introduction: intro,
                    description: desc
                };
            })
        );
        // await alertUsers(disastersWithPrecautions);
        const batch = db.batch();
        disastersWithPrecautions.forEach(disaster =>{
            const ref = fetchDisaster(disaster.id);
            batch.set(ref, disaster);
        })
        await batch.commit();
    } catch (error) {
        throw new Error(`Error adding active disasters: ${error}`);
    }
}

async function generatePrecautions(disasterType) {
    try {
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List 4-5 main precaution to be followed in a ${disasterType} disaster each containing 10-15 words max in form of bullteet list, directly give output no extra words or sentence.`,
        })
        return response.text;
    } catch (error) {
        throw new Error(`Error generating precautions: ${error.message}`);
    }
}

async function generateIntroduction(disasterType) {
    try {
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Complete this alert template for ${disasterType} disaster. Format: "An alert has been issued for your area due to ${disasterType} which may lead to [add possible risk here]`,
        })
        return response.text;
    } catch (error) {
        throw new Error(`Error generating description: ${error.message}`);
    }
}

async function generateDescription(disasterType) {
    try {
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Give short single sentence alert descrtption for ${disasterType} disaster for users under 10-15 words, directly give output no extra words or sentence.`,
        })
        return response.text;
    } catch (error) {
        throw new Error(`Error generating description: ${error.message}`);
    }
}

async function alertUsers(disasters) {
    try {
        for (const disaster of disasters){
        const unsafeUsers = await findUsersNear(disaster.latitude, disaster.longitude, disaster.rangeInKm);
        for(const user of unsafeUsers){
            const ref = getUser(user.id);
            await ref.update({disaster:disaster.id})
            let title;
            if(disaster.id.includes("H")){
                title = "High Alert"
            }else{
                title = "Alert"
            }
            const registrationToken = 'YOUR_REGISTRATION_TOKEN';
            const message = {
                notification: {
                    Title: title,
                    body: disaster.description
                },
                token: registrationToken
            };
            getMessaging().send(message).then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                throw new Error(`Error alerting users: ${error}`);
            });
        }
    }
    } catch (error) {
        throw new Error(`Error alerting user: ${error}`);
    }
}

async function findUsersNear(lat, lng, range) {
    try {
        const center = [lat, lng];
        const radiusInM = range / 1000;

        const bounds = geohashQueryBounds(center, radiusInM);
        const promises = [];

        for (const b of bounds) {
            const q = db.collection('Users')
                .where('disaster', '==', 'Safe')
                .orderBy('geohash')
                .startAt(b[0])
                .endAt(b[1]);
            promises.push(q.get());
        }

        const snapshots = await Promise.all(promises);

        const matchingDocs = [];    
        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const data = doc.data();
                const location = data.Location;
                const lat = location.latitude;
                const lng = location.longitude;
                const distanceInKm = distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                    matchingDocs.push(doc);
                }
            }
        }
        return matchingDocs;
    } catch (error) {
        throw new Error(`Error finding user: ${error}`);
    }
}

async function deleteAllCurrentDisasters(toDelete) {
    try {
        await updateUserStatus(toDelete);
        const batch = db.batch();
        toDelete.forEach(disaster => {
            const ref = fetchDisaster(disaster.id);
            batch.delete(ref);
        });
        await batch.commit();
    } catch (error) {
        throw new Error(`Error deleting disaster: ${error}`);
    }
    
}

async function updateUserStatus(disasters) {
    try {
        for( const disaster of disasters) {
            const ref = await db.collection("Users").where('disaster', '==', disaster.id).get()
            if(!ref.docs.length){
                continue;
            }else{
                ref.forEach((doc) => {
                    changeUserStatus(doc.id, "Safe");
                });
            }
        }
    } catch (error) {
        throw new Error(`Error updating user status: ${error}`)
    }
}

async function syncActiveDisaster() {
    try {
        const activeDisasters = await getActiveDisasters();
        const currentDisasters = await getCurrentDisasters();
        if(activeDisasters.length && currentDisasters.length){
            const apiIds = activeDisasters.map(d => d.id);
            const dbIds = currentDisasters.map(d => d.id);

            const toAdd = activeDisasters.filter(apiD => !dbIds.includes(apiD.id));
            const toDelete = currentDisasters.filter(dbD => !apiIds.includes(dbD.id));

            await addAllActiveDisasters(toAdd);
            await deleteAllCurrentDisasters(toDelete);
            console.log("Compare operation performed, Sync completed")
        }else if(activeDisasters.length === 0 && currentDisasters.length === 0){
            console.log("No operations performed, Sync completed");
        }else if(!activeDisasters.length){
            await deleteAllCurrentDisasters(currentDisasters)
            console.log("Only delete operation performed, Sync completed")
        }else{
            await addAllActiveDisasters(activeDisasters);
            console.log("Only add operations performed, Sync completed");
        }
    } catch (error) {
        console.error(`Sync Failed: ${error.message}`);
    }
}

async function getAllDisasters() {
    try {
        const snapshot = await fetchDisasters();
        let disasters = []
        for( const doc of snapshot.docs){
            const data = doc.data()
            disasters.push({
                id:doc.id,
                type:data.type,
                latitude: data.latitude,
                longitude:data.longitude
            })
        }
        return disasters
    } catch (error) {
        throw new Error(`Error fetching all disasters: ${error}`);
    }
}

async function getDisasterInfo(id) {
    try {
        const cityRef = fetchDisaster(id);
        const doc = await cityRef.get();
        if (!doc.exists) {
            return "Disaster not found";
        } else {
            return doc.data();
        }
    } catch (error) {
        throw new Error(`Error fetching disaster info: ${error}`);
    }
}

async function addDisaster(desc,type, lat, lng, prec, rang, sevr){
    try {
        let response = await setDisaster(`A${sevr[0]}${++no}`,{
            description: desc,
            type:type,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            precautions: prec,
            rangeInKm: parseFloat(rang)
        })
        return response;
    } catch (error) {
        throw new Error(`Error adding disaster: ${error}`);
    }
}

async function changeDisaster(id, updates) {
    try {
        const ref = fetchDisaster(id);
        if(updates.rangeInKm){
                updates.rangeInKm = parseFloat(updates.rangeInKm);
        }else if(updates.latitude){
            updates.latitude = parseFloat(updates.latitude);
        }else if(updates.longitude){
            updates.longitude = parseFloat(updates.longitude);
        }
        const res = await ref.update(updates);
        if(res){
            return "Disaster updated successfully";
        }
    } catch (error) {
        throw new Error(`Error updating disaster: ${error}`);
    }
}

export {updateUserStatus, syncActiveDisaster, getDisasterInfo, getAllDisasters, addDisaster, changeDisaster}