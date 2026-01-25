import express from "express";
import {connectDB} from "./src/config/Connection.js";
import userRoutes from "./src/routes/Users.js";
import disasterRoutes from "./src/routes/Disaster.js"
import adminRoutes from "./src/routes/Admin.js"
import bodyParser from "body-parser";
import checkDisasters from "./src/jobs/disasterjob.js";
import morgan from "morgan"
import cors from "cors"

const app = express();
export default app;

app.use(morgan("dev"));
app.use(express.json()) //only allow json data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET","POST","PUT","PATCH"],
    // allowedHeaders
}))

const apiVersion = "/api/v1/";

app.use(apiVersion+"User", userRoutes, disasterRoutes);
app.use(apiVersion+"Admin", adminRoutes, disasterRoutes);

app.get('/', (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/37637006/2sB3HqJdzQ")
})
try{

    connectDB();

    checkDisasters()

} catch (error) {
    console.log(error.message);
}