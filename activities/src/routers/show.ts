import express, {Request, Response} from "express";
import { NotFoundError } from "@zecamact/common";
import { Activity } from "../model/activities";

const router = express.Router();

router.get('/api/activities/:id',async (req:Request, res:Response)=>{
  const activity = await Activity.findById({_id:req.params.id});
  if(!activity){
    throw new NotFoundError();
  }

  res.send(activity);
})

export { router as showActivityRouter }