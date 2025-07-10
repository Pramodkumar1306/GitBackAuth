import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String,  required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpAt: {type: Number, default: 0},
    isAccountVerifed: {type: Boolean, default: false},
    resetOpt: {type: String, default: '' },
    resetOptExpAt: {type: Number, default: 0 },
})

const userModule = mongoose.models.MernAuth || mongoose.model('MernAuth', userSchema);

export default userModule;