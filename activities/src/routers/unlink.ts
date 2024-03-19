import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, currentUser, requireAuth } from "@zecamact/common";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete('/api/activities/upload/:pic',
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    let path = 'src/uploads/' + req.currentUser?.id + '/' + req.params.pic;
    console.log("unlink router:", path);
    if (!fs.existsSync(path)) throw new BadRequestError(path + ' do not exist');
    fs.unlink(path, (err) => {
      if (err) throw new BadRequestError(err.message);
      else {
        res.status(200).json({
          ok: true,
          message: '删除图片成功'
        })
      }
    })
  })

export { router as deletePictureRouter }
