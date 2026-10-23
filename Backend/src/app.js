import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.routes.js";
import morgan from "morgan";
import cors from "cors"


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use("/api/auth", authRouter);

export default app;
