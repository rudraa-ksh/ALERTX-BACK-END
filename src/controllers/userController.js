import {db} from "../config/Connection.js"

export async function checkUser(req,res){
    try {
        const userID = req.body.userid;
        const userRef = db.collection("Users").doc(userID);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('No such document!');
            return res.status(404).json({ message : "Document not found"});
        } else {
            return res.status(200).json(doc.data()["disaster"]);
        }
    } catch (error) {
        console.log(error);
    }
}