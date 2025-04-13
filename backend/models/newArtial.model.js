// models/FinalFeedsMap.js

import mongoose from "mongoose";

const ToneSchema = new mongoose.Schema({
  original: String,
  friendly: String,
  hinglish: String,
  hindi: String,
});

const FeedItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  link: String,
  category: String,
  pubDate: Date,
  image: String,
  source: String,
  title: ToneSchema,
  description: ToneSchema,
});

const FinalFeedMapSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  feeds: {
    type: Map,
    of: [FeedItemSchema],
    required: true,
  },
});

export default mongoose.models.FinalFeedMap ||
  mongoose.model("FinalFeedMap", FinalFeedMapSchema);
