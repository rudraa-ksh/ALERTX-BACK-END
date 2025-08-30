import {db} from "../config/Connection.js"

async function getUserStatus(userID) {
    try {
        const userRef = db.collection("Users").doc(userID);
        const userDoc = await userRef.get();
        return userDoc.data()["disaster"];
    } catch (error) {
        throw new Error(`Error getting user status ${error}`);
    }
}

function changeUserStatus(userID, id){
    try {
        const ref = db.collection("Users").doc(userID);
        ref.update({"disaster":id})
    } catch (error) {
        throw new Error(`Error changing user status ${error}`);
    }
}

function getUser(userID) {
    try {
        return db.collection("Users").doc(userID);
    } catch (error) {
        throw new Error(`Error getting user ${error}`);
    }
}
export {getUserStatus, changeUserStatus, getUser};