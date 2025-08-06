import {db} from "../config/Connection.js"
import { updateUserStatus } from "./disasterServices.js";
import {geohashQueryBounds, distanceBetween} from 'geofire-common';

async function check(userID) {
    const userRef = db.collection("Users").doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return "User document not Found";
    } else {
        let status = userDoc.data()["disaster"];
        if(status !== "SAFE"){
            const disasterRef = db.collection("Disaster").doc(status);
            const disasterDoc = await disasterRef.get();
            if (!disasterDoc.exists) {
                return "Disaster document not found";
            } else {
                return disasterDoc.data();
            }
        }else{
            return status;
        }
    }
}

async function checkNew(lat,long, userID){
    const snapshot = await db.collection("Disasters").get();
    const center = [lat, long];
    snapshot.forEach(doc => {
        const disaster = doc.data()
        const distanceInKm = distanceBetween([disaster.latitude, disaster.longitude], center);
        if(distanceInKm <= disaster.rangeInKm){
            const ref = db.collection("Users").doc(userID);
            ref.update({disaster:disaster.id})
        }
    });
}

export {check, checkNew};