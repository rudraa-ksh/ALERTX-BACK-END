import express from "express";
import {connectDB} from "./config/Connection.js"
import dotenv from 'dotenv';
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth",authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

try {
    const PORT = process.env.port;
    app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
} catch (error) {
    console.log(error);
}