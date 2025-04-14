import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routers/auth.route.js";
import rssRoutes from "./routers/rss.route.js";
import userRoutes from "./routers/user.route.js" 

import {cleanupOldFeeds} from  "./utility/cleanupFeeds.js"; // 👈 make sure the path is correct
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rss", rssRoutes);
app.use("/api/user", userRoutes);



// Uptime monitoring endpoint to keep the server alive (used by bots like UptimeRobot)
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

//Schedule to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running feed cleanup job...");
  cleanupOldFeeds();
});



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
