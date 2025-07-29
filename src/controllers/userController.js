import {db} from "../config/Connection.js"
import {check} from "../services/userServices.js";

export async function checkUser(req,res){
    try {
        const userID = req.body.userid;
        const status = await check(userID);
        return res.status(200).json(status);
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}