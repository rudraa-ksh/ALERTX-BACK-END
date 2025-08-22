import { getAuth } from "firebase-admin/auth";
import {check, checkNew} from "../services/userServices.js";

async function checkUser(req,res){
    const idtoken = req.headers.authorization.split('Bearer ')[1];
    getAuth().verifyIdToken(idtoken).then(async (decodedToken)=> {
        const userID = decodedToken.uid
        const status = await check(userID);
        return res.status(200).json(status);
    }).catch((error)=>{
        return res.status(404).json({message:error.message});
    })
}

async function checkNewUser(req, res) {
    const idtoken = req.headers.authorization.split('Bearer ')[1];
    getAuth().verifyIdToken(idtoken).then(async (decodedToken)=> {
        const lat = parseFloat(req.body.latitude);
        const long = parseFloat(req.body.longitude);
        const userID = decodedToken.uid;
        const status = await checkNew(lat, long, userID);
        return res.status(200).json({status:status});
    }).catch((error)=>{
        return res.status(404).json({message:error.message});
    })
}

export {checkUser, checkNewUser};