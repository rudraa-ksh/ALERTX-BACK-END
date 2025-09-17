import { getDisasterInfo, getAllDisasters } from "../services/disasterServices.js";
import { getAuth } from "firebase-admin/auth";

async function disasterInfo(req,res) {
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"})
    }else{
        const idToken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idToken).then(async ()=> {
            if(!req.body || !req.body.id){
                return res.status(400).json({message:"Disaster id not found"})
            }else{
                try {
                    const id = req.body.id;
                    const response = await getDisasterInfo(id)
                    if(response === "Disaster not found"){
                        return res.status(404).json({message:response});
                    }else{
                        return res.status(200).send(response);
                    }
                } catch (error) {
                    return res.status(500).json({"message":error.message});
                }
            }
        }).catch((error)=>{
            return res.status(401).json({message:error.message});
        })
    }
}
async function allDisaster(req,res) {
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"})
    }else{
        const idToken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idToken).then(async ()=> {
            try {
                const response = await getAllDisasters()
                return res.status(200).send(response);
            } catch (error) {
                return res.status(500).json({"message":error.message});
            }
        }).catch((error)=>{
            return res.status(401).json({message:error.message});
        })
    }
}

export {disasterInfo, allDisaster};