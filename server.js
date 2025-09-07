import express from "express";
import {connectDB} from "./src/config/Connection.js";
import dotenv from 'dotenv';
import userRoutes from "./src/routes/Users.js";
import disasterRoutes from "./src/routes/Disaster.js"
import adminRoutes from "./src/routes/Admin.js"
import bodyParser from "body-parser";
import checkDisasters from "./src/jobs/disasterjob.js";
import morgan from "morgan"

try {
    const app = express();

    dotenv.config()

    app.use(morgan("dev"));
    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: true }));

    const apiVersion = "/api/v1/";

    app.use(apiVersion+"User", userRoutes, disasterRoutes);
    app.use(apiVersion+"Admin", adminRoutes, disasterRoutes);

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    connectDB();

    checkDisasters()

    const port = process.env.PORT;
    app.listen(port,() => console.log(`Server running on port ${port}`));
} catch (error) {
    console.log(error.message);
}