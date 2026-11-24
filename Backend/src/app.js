import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routers/auth.routes.js"
import productRouter from "./routers/product.routes.js"
import cartRouter from "./routers/cart.routes.js"
import addressRouter from "./routers/address.routes.js";
import wishlistRouter from "./routers/wishlist.routes.js"
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./config/config.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.get("/health", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/wishlist",wishlistRouter)


const frontendPath = path.resolve(__dirname, "../../Frontend/dist");

app.use(express.static(frontendPath));

app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err) next(err);
    });
});

export default app;