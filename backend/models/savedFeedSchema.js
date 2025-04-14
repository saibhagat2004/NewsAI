// models/SavedFeed.js
import mongoose from 'mongoose';

const savedFeedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // if you have user system
  },
  feedId: {
    type: String,
    required: true,
  },
  feedData: {
    type: Object,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.SavedFeed || mongoose.model('SavedFeed', savedFeedSchema);
