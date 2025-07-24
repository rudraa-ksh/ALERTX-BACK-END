import {db} from "../config/Connection.js"

export async function checkUser(req,res){
    try {
        const userID = req.body.userid;
        const userRef = db.collection("Users").doc(userID);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message : "User document not found"});
        } else {
            let status = userDoc.data()["disaster"];
            if(status !== "Safe"){
                const disasterRef = db.collection("Disaster").doc(status);
                const disasterDoc = await disasterRef.get();
                if (!disasterDoc.exists) {
                    return res.status(404).json({message:"Disaster document not found"})
                } else {
                    return res.status(200).json(disasterDoc.data())
                }
            }else{
                return res.status(200).json(status);
            }
        }
    } catch (error) {
        console.log(error);
    }
}