import { getAuth } from "firebase-admin/auth";

const auth = async(req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(401).send({message:"Unauthorized"})
    }else{
        const idToken = req.headers.authorization.split('Bearer ')[1];
        getAuth().verifyIdToken(idToken).then((decodedToken)=>{
            req.user = decodedToken;
            next()
        }).catch((error)=>{
            return res.status(401).json({"message":error.message});
        })
    }
}

export {auth};