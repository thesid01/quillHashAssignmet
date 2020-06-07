import express from "express";
import "reflect-metadata";
import { createUserController, userLogin, updateProfilePicture, loadUsers } from "../controller/user";
import { auth } from "../middleware/auth";

import multer from 'multer';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        console.log("saving image");
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".")[1])
    }
  })
  var upload = multer({ storage: storage })  

const router = express.Router();

router.post('/createuser', createUserController);
router.post('/login', userLogin)
router.post('/profilepicture', auth, upload.single('photo'), updateProfilePicture)
router.get('/loadUsers', auth, loadUsers)

export default router;
