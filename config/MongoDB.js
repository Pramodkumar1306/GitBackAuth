import mongoose from 'mongoose'


const connectDB = async() => {
    try{
        await mongoose.connect(`mongodb+srv://pramod73kumar7415:qXZ2lC2hYOrNCzdi@cluster0.ysbbdul.mongodb.net/MernAuth`);
        console.log("Connected");
        
    }catch(error){
            console.error("DB Connection Failed:", error.message);
    }
}


export default connectDB;