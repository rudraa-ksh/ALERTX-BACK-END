import { cert, initializeApp } from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import config from "./serviceAccountKey.json" assert {type:"json"};

let db;

export async function connectDB(){
    
    try {
        initializeApp({
            credential: cert(config)
        });
        db = getFirestore();
        console.log("Database Connected");
    } catch (error) {
        console.log("Failed connecting to database",{message:error.message});
    }
};

export {db};