import {db} from "../config/Connection.js"
import {distanceBetween} from 'geofire-common';
import {fetchDisasters, getDisasterSummary} from "../repositories/disaster.js";
import {getUserStatus, changeUserStatus} from "../repositories/user.js";

async function check(userID) {
    let status = await getUserStatus(userID);
    if(status !== "SAFE"){
        return await getDisasterSummary(status);
    }else{
        return {"status": status};
    }
}

async function checkNew(lat,long, userID){
    const snapshot = await fetchDisasters();
    for(const doc of snapshot.docs){
        const disaster = doc.data()
        const distanceInKm = distanceBetween([disaster.latitude, disaster.longitude], [lat, long]);
        if(distanceInKm <= disaster.rangeInKm){
            changeUserStatus(userID, disaster.id);
            return await getDisasterSummary(disaster.id);
        }else{
            return {"status": "SAFE"};
        }
    };
}

export {check, checkNew};