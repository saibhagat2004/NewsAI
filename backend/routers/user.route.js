import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import {updateUser, toggleSaveFeed,  getSavedFeeds,updateUserPreferences,getUserPreferences } from "../controllers/users.controller.js";


const router = express.Router();

router.post('/save-feed', toggleSaveFeed);
// router.post("/update",protectRoute,updateUser);

router.get('/get-saved-feeds/:userId', getSavedFeeds);

router.post("/update-preference", updateUserPreferences);

router.get("/preferences/:userId", getUserPreferences);


export default router;