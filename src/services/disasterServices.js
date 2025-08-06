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

async function addAllActiveDisasters(active) {
    try {
        await alertUsers(active);

        const disastersWithPrecautions = await Promise.all(
            active.map(async (disaster) => {
                const response = await generatePrecautions(disaster.disasterType);
                return {
                    ...disaster,
                    precautions: response
                };
            })
        );
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
    updateUserStatus(toDelete);
    const batch = db.batch();
    toDelete.forEach(disaster => {
        const ref = db.collection("Disasters").doc(disaster.id);
        batch.delete(ref);
    });
    await batch.commit();
}

async function updateUserStatus(disasters) {
    for( const disaster of disasters) {
        const ref = await db.collection("Users").where('disaster', '==','DS15').get()
        ref.forEach((doc) => {
            const userRef = db.collection("Users").doc(doc.id);
            userRef.update({disaster:"SAFE"})
        });
    }
}


async function generatePrecautions(disasterType) {
    try {
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Give short precautions for ${disasterType} No headings, under 20 words each.`,
        })
        return response.text;
    } catch (error) {
        throw new Error(`Error generating precautions: ${error.message}`);
    }
}

async function alertUsers(disasters) {
    for (const disaster of disasters){
        const unsafeUsers = await findUsersNear(disaster.latitude, disaster.longitude, disaster.rangeInKm);

        for(const user of unsafeUsers){
            const ref = db.collection("Users").doc(user.id);
            await ref.update({disaster:disaster.id})
            //send push notification
        }
    }
}

export default async function syncActiveDisaster() {
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
        }else if(!activeDisasters.length){
            await deleteAllCurrentDisasters(currentDisasters)
            console.log("Only delete operation performed, Sync completed")
        }else if(activeDisasters.length === currentDisasters.length === 0){
            console.log("No operations performed, Sync completed");
        }else{
            await addAllActiveDisasters(activeDisasters);
            console.log("Only add operations performed, Sync completed");
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function findUsersNear(lat, lng, range) {
    const center = [lat, lng];
    const radiusInM = range / 1000;

    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
        const q = db.collection('Users')
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