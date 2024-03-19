import express, { Request, Response } from "express";
import { body } from "express-validator";
import { currentUser, requireAuth, validateRequests, BadRequestError } from "@zecamact/common";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const picPath = `src/uploads/${req.currentUser!.id}`;
      if (!fs.existsSync(picPath)) {
        fs.mkdirSync(picPath, { recursive: true });
      }
      cb(null, picPath);
    },
    filename(req, file, cb) {
      const extname = path.extname(file.originalname)
      cb(null, Date.now() + extname)
    }
  })
})

router.post('/api/activities/upload',
  requireAuth,
  currentUser,
  upload.single('file'),
  async (req: Request, res: Response) => {
    console.log("upload router:", req.file!.path);
    res.status(200).json({
      ok: true,
      message: '图片上传成功',
      data: {
        name: req.file!.filename,
        url: (req.file!.path).slice(3)
      }
    })
  })


export { router as uploadPictureRouter }
