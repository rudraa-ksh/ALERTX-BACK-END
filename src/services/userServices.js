import {distanceBetween} from 'geofire-common';
import {fetchDisasters, getDisasterSummary} from "../repositories/disaster.js";
import {getUserStatus, changeUserStatus} from "../repositories/user.js";

async function check(userId) {
    let status = await getUserStatus(userId);
    if(status !== "Safe"){
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
            await changeUserStatus(userID, doc.id);
            const res =  await getDisasterSummary(doc.id);
            return res;
        }else{
            return {"status": "Safe"};
        }
    };
}

export {check, checkNew};