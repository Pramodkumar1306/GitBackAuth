import express from 'express'
import { isAuthantintcation, logIn, logOut, register, sendVarifyOtp, verifyEmail ,sendResetOtp, resetPassword} from '../Controllers/AuthControler.js';
import userAuth from '../middleware/AuthMid.js';

const authRouter =  express.Router();

authRouter.get('/test',(req,res) => {
    res.send("Api Is Working")
});



authRouter.post('/regester',register);
authRouter.post('/login',logIn); 
authRouter.post('/logout',logOut);
authRouter.post('/send-verify-otp',userAuth,sendVarifyOtp); 
authRouter.post('/verify-Account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthantintcation);
authRouter.post('/sentresetotp',sendResetOtp); 
authRouter.post('/resetpassword',resetPassword);

export default authRouter;