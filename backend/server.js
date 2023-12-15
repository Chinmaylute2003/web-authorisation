import express from "express"
import dotenv from "dotenv"
import connectDB from "./conn/connDB.js";
import router from "./routes/userRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
dotenv.config()

const app = express();
const PORT = process.env.PORT
connectDB(process.env.MONGO_URL);
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use('/user/api/', router);


app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}...`)
})