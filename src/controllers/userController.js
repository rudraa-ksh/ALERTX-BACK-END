import {check, checkNew} from "../services/userServices.js";

async function checkUser(req,res){
    const userId = req.user.uid;
    try {
        const status = await check(userId);
        return res.status(200).json(status);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

async function checkNewUser(req, res) {
    if(!req.body || !req.body.latitude ||!req.body.longitude){
        return res.status(400).json({message:"Location not found"})
    }else{
        const lat = parseFloat(req.body.latitude);
        const lng = parseFloat(req.body.longitude);
        const userId = req.user.uid;
        try {
            const status = await checkNew(lat, lng, userId);
            return res.status(200).json(status);
        } catch (error) {
            return res.status(500).json({message:error.message});
        }
    }
}

export {checkUser, checkNewUser};