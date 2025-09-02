import { getAuth } from "firebase-admin/auth";
import {check, checkNew} from "../services/userServices.js";

async function checkUser(req,res){
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"});
    }else{
        const idToken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idToken).then(async (decodedToken)=> {
            const userId = decodedToken.uid;
            const status = await check(userId);
            return res.status(200).json(status);
        }).catch((error)=>{
            return res.status(404).json({message:error.message});
        })
    }
}

async function checkNewUser(req, res) {
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"});
    }else{
        const idToken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idToken).then(async (decodedToken)=> {
            if(!req.body || !req.body.latitude ||!req.body.longitude){
                return res.status(400).json({message:"Location not found"})
            }else{
                const lat = parseFloat(req.body.latitude);
                const lng = parseFloat(req.body.longitude);
                const userId = decodedToken.uid;
                const status = await checkNew(lat, lng, userId);
                return res.status(200).json(status);
            }
        }).catch((error)=>{
            return res.status(404).json({message:error.message});
        })
    }
}

export {checkUser, checkNewUser};