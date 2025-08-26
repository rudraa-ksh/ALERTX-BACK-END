import axios from "axios";
import {geohashQueryBounds, distanceBetween} from 'geofire-common';
import {db} from "../config/Connection.js"
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config()

async function getActiveDisasters() {
    try {
        const response = await axios.get(process.env.mockapi);
        return response.data.disasters;
    } catch (error) {
        throw new Error(`Error fetching active disasters: ${error.message}`);
    }
}

async function getCurrentDisasters(){
    try {
        const snapshot = await db.collection("Disasters").get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error(`Error fetching current disasters: ${error.message}`);
    }
}

async function getAllDisasters() {
    try {
        const snapshot = await db.collection("Disasters").get()
        let disasters = []
        for( const doc of snapshot.docs){
            const data = doc.data()
            disasters.push({
                id:data.id,
                type:data.disasterType,
                location:{
                    lat: data.latitude,
                    long:data.longitude
                }
            })
        }
        return disasters
    } catch (error) {
        throw new Error(`Error fetching all disasters: ${error.message}`);
    }
}

async function getDisasterInfo(id) {
    const cityRef = db.collection('Disasters').doc(id);
    const doc = await cityRef.get();
    if (!doc.exists) {
        return "Disaster not found";
    } else {
        return doc.data();
    }
}

async function addAllActiveDisasters(active) {
    try {
        const disastersWithPrecautions = await Promise.all(
            active.map(async (disaster) => {
                const response = await generatePrecautions(disaster.disasterType);
                const desc = await generateDescription(disaster.disasterType);
                return {
                    ...disaster,
                    precautions: response,
                    description: desc
                };
            })
        );
        await alertUsers(disastersWithPrecautions);
        const batch = db.batch();
        disastersWithPrecautions.forEach(disaster =>{
            const ref = db.collection("Disasters").doc(disaster.id);
            batch.set(ref, disaster);
        })
        await batch.commit();

    } catch (error) {
        throw new Error(`Error adding active disasters: ${error}`);
    }
}

async function deleteAllCurrentDisasters(toDelete) {
    await updateUserStatus(toDelete);
    const batch = db.batch();
    toDelete.forEach(disaster => {
        const ref = db.collection("Disasters").doc(disaster.id);
        batch.delete(ref);
    });
    await batch.commit();
}

async function updateUserStatus(disasters) {
    try {
        for( const disaster of disasters) {
            const ref = await db.collection("Users").where('disaster', '==', disaster.id).get()
            if(!ref.docs.length){
                continue;
            }else{
                ref.forEach((doc) => {
                    const userRef = db.collection("Users").doc(doc.id);
                    userRef.update({disaster:"SAFE"})
                });
            }
        }
    } catch (error) {
        throw new Error(`Error updating user status: ${error}`)
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

async function generateDescription(disasterType) {
    try {
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Give short single sentence alert descrtption for ${disasterType} disaster for nearby users under 10-15 words, directly give output no extra words or sentence.`,
        })
        return response.text;
    } catch (error) {
        throw new Error(`Error generating description: ${error.message}`);
    }
}

async function alertUsers(disasters) {
    for (const disaster of disasters){
        const unsafeUsers = await findUsersNear(disaster.latitude, disaster.longitude, disaster.rangeInKm);

        for(const user of unsafeUsers){
            const ref = db.collection("Users").doc(user.id);
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
                console.log('Error sending message:', error);
            });
        }
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
        console.error(error.message)
    }
}

async function findUsersNear(lat, lng, range) {
    const center = [lat, lng];
    const radiusInM = range / 1000;

    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
        const q = db.collection('Users')
            .where('disaster', '==', 'SAFE')
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
}

export {updateUserStatus, syncActiveDisaster, getDisasterInfo, getAllDisasters}