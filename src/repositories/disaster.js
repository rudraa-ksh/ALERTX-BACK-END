import {db} from "../config/Connection.js"

async function getDisasterSummary(did) {
    try {
        const disasterRef = db.collection("Disasters").doc(did);
        const disasterDoc = await disasterRef.get();
        const disasterInfo = disasterDoc.data();
        return {
            id:disasterInfo.id,
            description: disasterInfo.description
        };
    } catch (error) {
        throw new Error(`Error getting disaster summary ${error}`);
    }
}

async function fetchDisasters() {
    try {
        return await db.collection("Disasters").get();
    } catch (error) {
        throw new Error(`Error fetching disasters ${error}`);
    }
}

function fetchDisaster(id) {
    try {
        return db.collection("Disasters").doc(id)
    } catch (error) {
        throw new Error(`Error fetching disaster ${error}`);
    }
}

export { getDisasterSummary, fetchDisasters, fetchDisaster };