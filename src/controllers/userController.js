import { getAuth } from "firebase-admin/auth";
import {check, checkNew} from "../services/userServices.js";

async function checkUser(req,res){
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"});
    }else{
        const idtoken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idtoken).then(async (decodedToken)=> {
            const userID = decodedToken.uid;
            const status = await check(userID);
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
        const idtoken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idtoken).then(async (decodedToken)=> {
            if(!req.body || !req.body.lat ||!req.body.long){
                return res.status(400).json({message:"Location not found"})
            }else{
                const lat = parseFloat(req.body.lat);
                const long = parseFloat(req.body.long);
                const userID = decodedToken.uid;
                const status = await checkNew(lat, long, userID);
                return res.status(200).json({status:status});
            }
        }).catch((error)=>{
            return res.status(404).json({message:error.message});
        })
    }
}

export {checkUser, checkNewUser};