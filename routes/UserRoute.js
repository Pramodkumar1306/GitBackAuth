import { Router } from "express";
import express from 'express'
import { getUserData } from "../Controllers/UserControler.js";
import userAuth from'../middleware/AuthMid.js'
const userRoute = express.Router();

userRoute.get('/userdata',userAuth, getUserData)


export default userRoute;