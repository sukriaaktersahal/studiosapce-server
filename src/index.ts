// server src index.ts file
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {auth} from "./lib/auth.js";
import {toNodeHandler} from "better-auth/node";
import studiosRouter from "./routes/studios.js";
import authTokenRouter from "./routes/auth-token.js";
import bookingsRouter from "./routes/bookings.js";

dotenv.config();

const app = express();
const PORT= process.env.PORT || 5000;

// CORS setup
app.use(
  cors({
    origin : process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, 
  })
);

// BetterAuth endpoint handlers
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({limit : "10mb"}));
app.use(cookieParser());

app.use("/api/studios", studiosRouter);
app.use("/api/auth-token", authTokenRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) =>{
  res.json({message : "StudioSpace API is running!", status: "ok"});
});

app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});