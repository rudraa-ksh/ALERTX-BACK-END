import { getDisasterInfo, getAllDisasters } from "../services/disasterServices.js";

async function disasterInfo(req,res){
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
}
async function allDisaster(req,res) {
    try {
        const response = await getAllDisasters()
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).json({"message":error.message});
    }
}

export {disasterInfo, allDisaster};