
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import SavedFeed from '../models/savedFeedSchema.js';



export const updateUser = async (req, res) => {
	const { fullName, goal, username, weight , height , currentPassword, newPassword} = req.body;
	// let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		user.fullName = fullName || user.fullName;      //if user pass fullName then we update it  OR just keep old fullName
		user.weight = weight || user.weight;
        user.height = height || user.height;
        user.goal = goal || user.goal;
		user.username = username || user.username;
		// user.profileImg = profileImg || user.profileImg;
        //user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response not in database
		user.password = null; 

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};



// controllers/feedController.js

export const toggleSaveFeed = async (req, res) => {
  try {
    const { userId, feedId, feedData } = req.body;

    if (!userId || !feedId || !feedData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if feed is already saved
    const existingFeed = await SavedFeed.findOne({ userId, feedId });

    if (existingFeed) {
      // If exists, remove it (unsave)
      await SavedFeed.deleteOne({ _id: existingFeed._id });
      return res.status(200).json({ message: 'Feed removed successfully', isSaved: false });
    } else {
      // Else, save it
      await SavedFeed.create({ userId, feedId, feedData });
      return res.status(200).json({ message: 'Feed saved successfully', isSaved: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};






// Controller to get all saved feeds for a user
export const getSavedFeeds = async (req, res) => {
	try {
	  const { userId } = req.params;
  
	  if (!userId) {
		return res.status(400).json({ message: 'User ID is required' });
	  }
  
	  const savedFeeds = await SavedFeed.find({ userId });
  
	  res.status(200).json(savedFeeds);
	} catch (error) {
	  console.error('Error fetching saved feeds:', error);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  };
  

  export const updateUserPreferences = async (req, res) => {
	try {
	  const { userId, tone, categories } = req.body;
  
	  if (!userId) return res.status(400).json({ error: "User ID is required" });
  
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{
		  preferredTone: tone,
		  preferredCategories: categories,
		},
		{ new: true }
	  );
  
	  if (!updatedUser) return res.status(404).json({ error: "User not found" });
  
	  res.status(200).json({ message: "Preferences updated", user: updatedUser });
	} catch (err) {
	  console.error("❌ Error updating preferences:", err.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };



export const getUserPreferences = async (req, res) => {
	try {
	  const { userId } = req.params; // You will send userId as a route param (e.g., /preferences/:userId)
  
	  if (!userId) return res.status(400).json({ error: "User ID is required" });
  
	  const user = await User.findById(userId).select("preferredTone preferredCategories");
  
	  if (!user) return res.status(404).json({ error: "User not found" });
  
	  res.status(200).json({
		preferredTone: user.preferredTone || "original",
		preferredCategories: user.preferredCategories || [],
	  });
	} catch (err) {
	  console.error("❌ Error fetching preferences:", err.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
  