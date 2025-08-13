import { getDisasterInfo, getAllDisasters } from "../services/disasterServices.js";

async function disasterInfo(req,res) {
    try {
        const id = req.body.id;
        const response = await getDisasterInfo(id)
        return res.status(200).send(response);
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}
async function allDisaster(req,res) {
    try {
        const response = await getAllDisasters()
        return res.status(200).send(response);
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}

export {disasterInfo, allDisaster};