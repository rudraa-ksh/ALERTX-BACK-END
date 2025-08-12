import {db} from "../config/Connection.js"
import {distanceBetween} from 'geofire-common';

async function check(userID) {
    const userRef = db.collection("Users").doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return "User document not Found";
    } else {
        let status = userDoc.data()["disaster"];
        if(status !== "SAFE"){
            const disasterRef = db.collection("Disasters").doc(status);
            const disasterDoc = await disasterRef.get();
            if (!disasterDoc.exists) {
                return "Disaster document not found";
            } else {
                const disaster = disasterDoc.data();
                return {
                    id:disaster.id,
                    description: disaster.description
                };
            }
        }else{
            return status;
        }
    }
}

async function checkNew(lat,long, userID){
    const snapshot = await db.collection("Disasters").get();
    for(const doc of snapshot.docs){
        const disaster = doc.data()
        const distanceInKm = distanceBetween([disaster.latitude, disaster.longitude], [lat, long]);
        if(distanceInKm <= disaster.rangeInKm){
            const ref = db.collection("Users").doc(userID);
            ref.update({disaster:disaster.id})
            return disaster.id;
        }else{
            return "SAFE";
        }
    };
}

export {check, checkNew};