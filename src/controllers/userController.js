import {check, checkNew, register, update} from "../services/userServices.js";

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

async function registerUser(req, res) {
    try {
        const fname = req.body.firstname
        const lname = req.body.lastname
        const userID = req.body.userid
        const lat = parseFloat(req.body.latitude)
        const long = parseFloat(req.body.longitude)
        const response = await register(userID, fname, lname, lat, long);
        return res.status(200).json({status: response})
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}

async function updateLocation(req, res) {
    try {
        const lat = parseFloat(req.body.latitude);
        const long = parseFloat(req.body.longitude);
        const userID = req.body.userid;
        const response = await update(userID, lat, long);
        return res.status(200).json({status: response})
    } catch (error) {
        return res.status(404).json({message:error.message});
    }
}

export {checkUser, checkNewUser, registerUser, updateLocation};