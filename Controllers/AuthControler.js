import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModule from '../Models/UserModel.js';
import transporter from '../config/nodemailer.js';
// import { StrictMode } from 'react';

export const register = async(req, res) => {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.json({success: false, message:"Missing Detials "})
        }

        try {
            const existingUser = await userModule.findOne({email});
            if(existingUser) {
                return res.json({success:false, message:"User Already Exists"});
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModule({name,email,password:hashedPassword});
            await user.save();

            const token = jwt.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: '7d'});
            
            res.cookie('token', token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            //Sending the welcome emails

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to:email,
                subject: 'Welcome Pramod Created Your Account So Enjoy',
                text: `Maja a Raha Applications Ka Enjoy And Enjoy You Account is Created SuccessFully ${name}  Aur tum Ye Email Use Kar rahai ho ${email}`
            }
            await transporter.sendMail(mailOptions);
            return res.json({success:true})
        } catch (error) {
            res.json({success:false, message: `${error} some error occured`})
        }
    }

export const logIn = async(req,res) => {
    const {email,password} = req.body;

    if(!email || !password ) {
        return res.json({success:false, message: 'email and pasword is needed'});
    }

    try {
        const user = await userModule.findOne({email});
        if(!user) {
            return res.json({success:false, message: "Invalid Email"});
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) {
            return res.json({success: false, message: "Invalid Password"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: '7d'});
            
            res.cookie('token', token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({success:true});

    } catch (error) {
        return res.json({success: false, message: error.message});
    } 
}

export const logOut = async(req,res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None'
        })

        return res.json({success:true, message:"Log Out"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}


// Verification OTP

export const sendVarifyOtp = async (req,res) => {
    try {
        const {userId} = req.body;
        const user = await userModule.findById(userId);
        if(user.isAccountVerifed){
            return res.json({success: false, message: "Account Already Verified"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP. Fast You Have Lots Of Time`
            
        }

        await transporter.sendMail(mailOptions);
        return res.json({success: true, message: "Sent the Email to The Email Check Once"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}
// VERYFIE THE EMAIL 
export const verifyEmail = async(req,res) => {
    const {userId,otp} = req.body;

    if(!userId || !otp) {
        return res.json({success: false,  message: "Missing the data "});
    }

    try {
        const user = await userModule.findById(userId);
        
        if(!user) {
            return res.json({success:true, message: "The otp not found"})
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message:"Invalid OTP"})
        }

        if(user.verifyOtpExpAt < Date.now()) {
            return res.json({success: false, message: "OTP Expired"})
        }

        user.isAccountVerifed = true;
        user.verifyOtp = "";
        user.verifyOtpExpAt = 0;

        await user.save();
        return res.json({success: true, message: "Email verified successfully. "});

    } catch (error) {
        return res.json({success: false, message: `${error.message} catch block` });
    }
}

export const isAuthantintcation = async(req,res) => {
    try {
        
        return res.json({success: true });
    } catch (error) {
        res.json({success: true, message: `${error.message} is Auth error`})
    }
}


// Main to change the password using otp 

export const sendResetOtp = async (req,res) => {
    const {email} = req.body;

    if(!email) {
        return res.json({success:false , message: " Email is needed"});

    } 
    try {
        const user = await userModule.findOne({email});
        if(!user) {
            return res.json({success: false, message: 'User Not Found'});
        }
          const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOpt = otp;
        user.resetOptExpAt = Date.now() + 15 * 60 * 1000;

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject: 'No Rush! Here’s Your Password Reset Code',
            text: `Your One-Time Password (OTP) is ${otp}. Use this code 
            to reset your password securely. No rush — you've got plenty of time to 
            complete the process!` 
        }
        await transporter.sendMail(mailOptions);

        return res.json({success:true, message: "OTP sent to your email"})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

//reset user password 

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Oops! Email, OTP, and new password are all required to proceed." });
    }

    try {
        const user = await userModule.findOne({ email }); 
        if (!user) {
            return res.json({ success: false, message: "Hmm... we couldn't find an account with this email." });
        } 
        
        if (user.resetOpt === "" || user.resetOpt !== otp) {
            return res.json({ success: false, message: "Uh-oh! The OTP you entered is incorrect. Please try again." });
        }

        if (user.resetOtpExpAt < Date.now()) {
            return res.json({ success: false, message: "Looks like your OTP has expired. Please request a new one." });
        }
        const hashedPasword = await bcrypt.hash(newPassword,10);
        user.password = hashedPasword;
        user.resetOtp = '';
        user.resetOptExpAt = 0;

        await user.save();

        return res.json({ success: true, message: "Success! Your password has been changed. You're all set to log in with your new credentials!" });

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}