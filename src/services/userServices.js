import {db} from "../config/Connection.js"
import {distanceBetween} from 'geofire-common';

async function check(userID) {
    const userRef = db.collection("Users").doc(userID);
    const userDoc = await userRef.get();
    let status = userDoc.data()["disaster"];
    if(status !== "SAFE"){
        const disasterRef = db.collection("Disasters").doc(status);
        const disasterDoc = await disasterRef.get();
        const disaster = disasterDoc.data();
        return {
            id:disaster.id,
            description: disaster.description
        };
    }else{
        return {status: status};
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
            const disasterRef = db.collection("Disasters").doc(disaster.id);
            const disasterDoc = await disasterRef.get();
            const disasterInfo = disasterDoc.data();
            return {
                id:disasterInfo.id,
                description: disasterInfo.description
            };
        }else{
            return {status: "SAFE"};
        }
    };
}

export {check, checkNew};