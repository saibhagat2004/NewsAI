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
import {cleanupOldFeeds} from "./utility/cleanupFeeds.js"
import { buildSummarization } from "./controllers/rss.controller.js";
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



cron.schedule("0 0 * * *", () => {
  console.log("✅ Clenning up At: ", new Date().toLocaleTimeString());
  cleanupOldFeeds();
});


cron.schedule("0 * * * *", async () => {
  console.log("🕐 Running hourly buildSummarization job...");
    await buildSummarization();
    console.log("✅ Summarization complete!");
});



if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.listen(PORT,async () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();


  // Run summarization immediately on startup
  console.log("🔥 Triggering initial feed summarization...");
  try {
    await buildSummarization();
    console.log("✅ Initial summarization complete!");

    console.log("✅ Clenning up At: ", new Date().toLocaleTimeString());
  cleanupOldFeeds();
  } catch (error) {
    console.error("❌ Initial summarization failed:", error.message);
  }
});
