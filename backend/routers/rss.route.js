import express from "express";
import { getHeadlines, fetchAndMergeFeeds ,buildSummarization, extractAllNewsAsFeedMap} from "../controllers/rss.controller.js";

const router = express.Router();

// Route to fetch headlines
router.get("/headlines", getHeadlines);

// Route to fetch and merge feeds based on selected categories
router.post("/", fetchAndMergeFeeds);

router.get("/extractAll",  extractAllNewsAsFeedMap);

// router.get("/allFeed",  fetchFeedsForSummarization );

router.get("/aisummary",   buildSummarization );

export default router;