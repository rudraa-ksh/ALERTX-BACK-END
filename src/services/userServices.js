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

async function register(userID, fname, lname, lat, long) {
    const batch = db.batch();
    const ref = db.collection("Users").doc(userID);
    batch.set(ref, {
        FName:fname,
        LName: lname,
        Location:[lat, long],
        geoHash: geohashForLocation([lat, long])
    })
    await batch.commit();
}

async function update(userID, lat, long) {
    const ref = db.collection("Users").doc(userID);
    ref.update({
        Location : [lat, long],
        geoHash: geohashForLocation([lat, long])
    }).then(() => {
        return "Locationupdated successfully"
    })
    .catch((error) => {
        return `Error updating location ${error.message}`
    });
}

export {check, checkNew, register, update};