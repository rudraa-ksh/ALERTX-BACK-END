import { addDisaster, changeDisaster} from "../services/disasterServices.js";
import { getAuth } from "firebase-admin/auth";

function createDisaster(req,res) {
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"})
    }else{
        const idToken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idToken).then(async ()=> {
            if(!req.body || !req.body.description || !req.body.type || !req.body.latitude || !req.body.longitude || !req.body.precautions || !req.body.rangeInKm || !req.body.severity){
                return res.status(400).json({message:"All disaster data not found"})
            }else{
                const response = await addDisaster(req.body.description, req.body.type, req.body.latitude, req.body.longitude, req.body.precautions, req.body.rangeInKm, req.body.severity)
                return res.status(200).send({"status": response});
            }
        }).catch((error)=>{
            return res.status(404).json({"message":error.message});
        })
    }
}

function updateDisaster(req,res){
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"})
    }else{
        const idtoken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idtoken).then(async ()=> {
            if(!req.body || !req.query.id){
                return res.status(400).json({message:"Disaster data not found"})
            }else{
                const response = await changeDisaster(req.query.id, req.body)
                return res.status(200).send({"status": response});
            }
        }).catch((error)=>{
            return res.status(404).json({"message":error.message});
        })
    }
}

export {createDisaster, updateDisaster};