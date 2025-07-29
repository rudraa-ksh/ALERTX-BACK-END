import {db} from "../config/Connection.js"

async function check(userID) {
    const userRef = db.collection("Users").doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return "User document not Found";
    } else {
        let status = userDoc.data()["disaster"];
        if(status !== "Safe"){
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

export {check};