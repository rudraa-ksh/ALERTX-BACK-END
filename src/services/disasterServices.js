import axios from "axios";
import {db} from "../config/Connection.js"

async function getActiveDisaster() {
    try {
        const response = await axios.get(process.env.mockapi);
        return response.data.disasters;
    } catch (error) {
        return `Error fetching active disasters: ${error.message}`;
    }
}

async function getCurrentDisaster(){
    try {
        const snapshot = await db.collection("Disaster").get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

export default async function syncActiveDisaster() {
    try {
        const active = await getActiveDisaster();
        const current = await getCurrentDisaster();

        const apiIds = active.map(d => d.id);
        const dbIds = current.map(d => d.id);

        const toAdd = active.filter(apiD => !dbIds.includes(apiD.id));
        const toDelete = current.filter(dbD => !apiIds.includes(dbD.id));

        const batch = db.batch();

        toAdd.forEach(disaster => {
        const ref = db.collection("Disaster").doc(disaster.id);
        batch.set(ref, disaster);
        });

        toDelete.forEach(disaster => {
        const ref = db.collection("Disaster").doc(disaster.id);
        batch.delete(ref);
        });

        await batch.commit();
    } catch (error) {
        console.log(error);
    }
}