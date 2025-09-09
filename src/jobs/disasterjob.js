import cron from "node-cron";
import {syncActiveDisaster} from "../services/disasterServices.js";

export default async function checkDisasters(){
    cron.schedule("0 10,15 * * * ",async ()=>{
        await syncActiveDisaster();
    });
}
