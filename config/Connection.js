import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

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
        const db = getFirestore(app);
        console.log("Database Connected");
    } catch (error) {
        console.log("Failed connecting to database",{message:error.message});
    }
}