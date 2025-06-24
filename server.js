import express from "express";
import {connectDB} from "./config/Connection.js"
import dotenv from 'dotenv';

dotenv.config();

const app = express();

connectDB();

try {
    const port = process.env.port;
    app.listen(port,() => console.log(`Server running on port ${port}`));
} catch (error) {
    console.log(error);
}