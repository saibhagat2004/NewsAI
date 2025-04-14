import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import {updateUser, toggleSaveFeed,  getSavedFeeds } from "../controllers/users.controller.js";


const router = express.Router();

router.post('/save-feed', toggleSaveFeed);
router.post("/update",protectRoute,updateUser);

router.get('/get-saved-feeds/:userId', getSavedFeeds);


export default router;