import FinalFeedMap from "../models/newArtial.model.js";

export const cleanupOldFeeds = async () => {
  try {
    console.log("Checking for outdated feeds...");
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago  

    const docs = await FinalFeedMap.find();

    for (const doc of docs) {
      let updated = false;

      for (const [category, items] of doc.feeds.entries()) {
        const filtered = items.filter(item => new Date(item.pubDate) >= cutoffDate);

        if (filtered.length !== items.length) {
          doc.feeds.set(category, filtered);
          updated = true;
        }
      }

      if (updated) {
        await doc.save();
        console.log(`✅ Cleaned document ${doc._id}`);
      }
    }

    console.log("Cleanup completed ✅");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
};
