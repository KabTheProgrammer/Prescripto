import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB  from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import paymentRouter from './routes/paymentRoute.js'

//app config

const app = express()
const port = process.env.PORT || 4000

// Middlewares
app.use(express.json())
const allowedOrigins = [
  // 'https://prescripto-frontend-6v4zcl59j-kabirus-projects-4ce204e8.vercel.app',
  // "https://prescripto-admin-five.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

connectDB()
connectCloudinary()

// api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

//Payment
app.use('/api/payments', paymentRouter);

app.get('/',(req, res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started",port))