import express from 'express'
import userModule from '../Models/UserModel.js'

export const getUserData = async(req,res) => {
    try {
        
        const {userId} = req.body; 
        const user = await userModule.findById(userId);
        if(!user) {
            return res.json({success: false, message: "User Not Found"})
        }

        res.json({
            success:true,
            userData: {
                name: user.name,
                isAccountVerifed:user.isAccountVerifed
            }
        })

    } catch (error) {
        res.json({success:false , message:error.message + "asdasd"})
    }
}