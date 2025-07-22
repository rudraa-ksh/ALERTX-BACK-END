import express from "express";
import {connectDB} from "./config/Connection.js"
import dotenv from 'dotenv';
import bodyParser from "body-parser";

import disasterRoutes from "./routes/disaster.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/disaster",disasterRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

try {
    const PORT = process.env.port;
    app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
} catch (error) {
    console.log(error);
}