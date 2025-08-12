import {check, checkNew} from "../services/userServices.js";

async function checkUser(req,res){
    try {
        const userID = req.body.userid;
        const status = await check(userID);
        return res.status(200).json(status);
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}

async function checkNewUser(req, res) {
    try {
        const lat = parseFloat(req.body.latitude);
        const long = parseFloat(req.body.longitude);
        const userID = req.body.userid;
        const status = await checkNew(lat, long, userID);
        return res.status(200).json({status:status});
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}

export {checkUser, checkNewUser};