import {db} from "../config/Connection.js"

async function getDisasterSummary(did) {
    try {
        const disasterRef = fetchDisaster(did);
        const disasterDoc = await disasterRef.get();
        const disasterInfo = disasterDoc.data();
        return {
            status: disasterDoc.id[1]=== 'H' ?"High ALert":"Alert",
            id:disasterDoc.id,
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

async function setDisaster(id,toAdd){
    try {
        const res = await db.collection('Disasters').doc(id).set(toAdd);
        if(res){
            return "Disaster Added Successfully"
        }
    } catch (error) {
        throw new Error(`Error setting disaster ${error}`);
    }
}

export { getDisasterSummary, fetchDisasters, fetchDisaster, setDisaster};
