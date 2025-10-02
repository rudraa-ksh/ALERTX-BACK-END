import { addDisaster, changeDisaster} from "../services/disasterServices.js";

async function createDisaster(req,res) {
    if(!req.body || !req.body.description || !req.body.type || !req.body.latitude || !req.body.longitude || !req.body.precautions || !req.body.rangeInKm || !req.body.severity){
        return res.status(400).json({message:"All disaster data not found"})
    }else{
        try {
            const response = await addDisaster(req.body.description, req.body.type, req.body.latitude, req.body.longitude, req.body.precautions, req.body.rangeInKm, req.body.severity)
            return res.status(200).send({"status": response});
        } catch (error) {
            return res.status(500).json({"message":error.message});
        }
    }
}

async function updateDisaster(req,res){
    if(!req.body || !req.query.id){
        return res.status(400).json({message:"Disaster data not found"})
    }else{
        try {
            const response = await changeDisaster(req.query.id, req.body)
            return res.status(200).send({"status": response});
        } catch (error) {
            return res.status(500).json({"message":error.message});
        }
    }
}

export {createDisaster, updateDisaster};