import { cert, initializeApp } from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config()

const config = JSON.parse(process.env.FIREBASE_CONFIG)

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