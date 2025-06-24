import { initializeApp } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain:process.env.authDomain,
    projectId:process.env.projectId,
    storageBucket:process.env.storageBucket,
    messagingSenderId:process.env.messagingSenderId,
    appId: process.env.appId,
};

export async function connectDB(){
    try {
        const app = initializeApp(firebaseConfig);
        console.log("Database Connected");
    } catch (error) {
        console.log("Failed connecting to database",{message:error.message});
    }
};