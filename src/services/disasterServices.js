import axios from "axios";
import {db} from "../config/Connection.js"
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config()

async function getActiveDisasters() {
    try {
        const response = await axios.get(process.env.mockapi);
        console.log(response.data.disasters)
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

async function deleteAllCurrentDisasters() {
    try {
        const batch = db.batch();
        const snapshot = await db.collection("Disasters").get();
        snapshot.docs.forEach((doc)=>{
            batch.delete(doc.ref);
        })
        await batch.commit()
    } catch (error) {
        throw new Error(`Error deleting current disasters: ${error.message}`);
    }
}

async function addAllActiveDisasters(active) {
    try {
        const batch = db.batch();
        const disastersWithPrecautions = await Promise.all(
            active.map(async (disaster) => {
                const response = await generatePrecautions(disaster.disasterType);
                return {
                    ...disaster,
                    precautions: response
                };
            })
        );
        disastersWithPrecautions.forEach(disaster =>{
            const ref = db.collection("Disasters").doc(disaster.id);
            batch.set(ref, disaster);
        })
        await batch.commit();
    } catch (error) {
        throw new Error(`Error adding all active disasters: ${error.message}`);
    }
}

async function addDisasters(toAdd) {
    const batch = db.batch();
    const disastersWithPrecautions = await Promise.all(
        toAdd.map(async (disaster) => {
            const response = await generatePrecautions(disaster.disasterType);
            return {
                ...disaster,
                precautions: response
            };
        })
    );

    disastersWithPrecautions.forEach(disaster => {
        const ref = db.collection("Disasters").doc(disaster.id);
        batch.set(ref, disaster);
    });
    await batch.commit();
}

async function deleteDisasters(toDelete) {
    const batch = db.batch();
    toDelete.forEach(disaster => {
        const ref = db.collection("Disasters").doc(disaster.id);
        batch.delete(ref);
    });
    await batch.commit();
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

export default async function syncActiveDisaster() {
    try {
        const activeDisasters = await getActiveDisasters();
        const currentDisasters = await getCurrentDisasters();
        if(activeDisasters.length && currentDisasters.length){
            const apiIds = activeDisasters.map(d => d.id);
            const dbIds = currentDisasters.map(d => d.id);

            const toAdd = activeDisasters.filter(apiD => !dbIds.includes(apiD.id));
            const toDelete = currentDisasters.filter(dbD => !apiIds.includes(dbD.id));

            await addDisasters(toAdd);
            await deleteDisasters(toDelete);
            console.log("Compare operation performed, Sync completed")
        }else if(!activeDisasters.length){
            await deleteCurrentDisasters();
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