import { cert, initializeApp } from 'firebase-admin/app';
// import dotenv from 'dotenv';
import config from "./serviceAccountKey.json" assert {type:"json"};

// dotenv.config();

// const firebaseConfig = {
//     apiKey: process.env.apiKey,
//     authDomain:process.env.authDomain,
//     projectId:process.env.projectId,
//     storageBucket:process.env.storageBucket,
//     messagingSenderId:process.env.messagingSenderId,
//     appId: process.env.appId,
// };

export async function connectDB(){
    try {
        const app = initializeApp({
            credential: cert(config)
        });
        console.log("Database Connected");
    } catch (error) {
        console.log("Failed connecting to database",{message:error.message});
    }
};