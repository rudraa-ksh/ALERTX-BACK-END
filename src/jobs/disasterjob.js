import cron from "node-cron";
import syncActiveDisaster from "../services/disasterServices";

export default async function checkDisasters(){
    cron.schedule("0 0 * * * ",async ()=>{
        await syncActiveDisaster();
    });
}