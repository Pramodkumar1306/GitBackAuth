import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/MongoDB.js';
import authRouter from './routes/AuthRoute.js';
import userRoute from './routes/UserRoute.js'

const app = express();
const PORT = process.env.PORT || 8080; 
const allowedOrigin = ['http://localhost:5173','https://auth-login-mern-ta9e.vercel.app','https://auth-login-mern-pbx2.vercel.app']
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigin.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
    }));


connectDB();
    //API End Points
app.get('/',(req,res) => {
    res.send("Api Is Working")
})
app.use('/api/auth',authRouter);
app.use('/api/user',userRoute);



app.listen(PORT,()=> {
    console.log(`${PORT} Running`)
})

 