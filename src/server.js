import express from "express";
import {connectDB} from "./config/Connection.js";
import dotenv from 'dotenv';
import userRoutes from "./routes/Users.js";
import bodyParser from "body-parser";

try {
    const app = express();

    dotenv.config()

    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: true }));

    const apiVersion = "/api/v1/";

    app.use(apiVersion+"User", userRoutes);

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    connectDB();

    const PORT = process.env.port;
    app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
} catch (error) {
    console.log(error.message);
}