import { getDisasterInfo, getAllDisasters } from "../services/disasterServices.js";

async function disasterInfo(req,res) {
    const idtoken = req.headers.authorization.split('Bearer ')[1];
    getAuth().verifyIdToken(idtoken).then(async (decodedToken)=> {
        const id = req.body.id;
        const response = await getDisasterInfo(id)
        return res.status(200).send(response);
    }).catch((error)=>{
        return res.status(404).json({message:error.message});
    })
}
async function allDisaster(req,res) {
    const idtoken = req.headers.authorization.split('Bearer ')[1];
    getAuth().verifyIdToken(idtoken).then(async (decodedToken)=> {
        const response = await getAllDisasters()
        return res.status(200).send(response);
    }).catch((error)=>{
        return res.status(404).json({message:error.message});
    })
}

export {disasterInfo, allDisaster};