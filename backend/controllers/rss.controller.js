import Parser from "rss-parser";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FinalFeedMap from "../models/newArtial.model.js";
import { subHours } from 'date-fns';
// cron.js
import cron from "node-cron";


const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }], // store media:content as `mediaContent`
    ],
  },
});

const rssFeeds = {
  markets: "https://www.thehindubusinessline.com/markets/feeder/default.rss",
  economy: "https://www.thehindubusinessline.com/economy/feeder/default.rss",
  sports: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
  politics: "https://www.news18.com/commonfeeds/v1/eng/rss/politics.xml",
  entertainment: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
  world: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  headlines: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
  tech: "https://feeds.feedburner.com/gadgets360-latest",
  health: "https://feeds.feedburner.com/ndtvcooks-latest",
};

// Controller to fetch headlines
export async function getHeadlines(req, res) {
  try {
    const feed = await parser.parseURL(rssFeeds.politics);

    const feedData = feed.items.map((item) => {
      let image = null;

      // Access media:content and extract image URL
      if (item.mediaContent && item.mediaContent.length > 0) {
        const media = item.mediaContent[0];
        if (media && media.$ && media.$.url) {
          image = media.$.url;
        }
      }

      // Fallback: enclosure
      if (!image && item.enclosure && item.enclosure.url) {
        image = item.enclosure.url;
      }

      // Fallback: img tag in description
      if (!image && item.description) {
        const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
        image = imageMatch ? imageMatch[1] : null;
      }

      return {
        title: item.title,
        link: item.link,
        description: item.contentSnippet || item.content || item.description || "",
        pubDate: item.pubDate,
        image,
      };
    });

    res.json(feedData);
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
}




// Utility to parse and normalize one feed
async function parseFeed(url, categoryName) {
  const feed = await parser.parseURL(url);
  return feed.items.map((item) => {
    let image = null;

    // Access media:content and extract image URL
    if (item.mediaContent && item.mediaContent.length > 0) {
      const media = item.mediaContent[0];
      if (media && media.$ && media.$.url) {
        image = media.$.url;
      }
    }

    // Fallback: enclosure
    if (!image && item.enclosure && item.enclosure.url) {
      image = item.enclosure.url;
    }

    // Fallback: img tag in description
    if (!image && item.description) {
      const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
      image = imageMatch ? imageMatch[1] : null;
    }

    return {
      title: item.title,
      link: item.link,
      description: item.contentSnippet || item.content || "",
      pubDate: new Date(item.pubDate),
      image,
      category: categoryName,
    };
  });
}

// Shuffle utility
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Weighted merge utility
function weightedMerge(feedsMap, selectedCategories, totalItems = 25) {
  const merged = [];

  const selectedWeight = 0.85; // 85% from selected
  const fallbackWeight = 1 - selectedWeight; // 15% from others

  const selectedLength = selectedCategories.length;
  const otherLength = Object.keys(feedsMap).length - selectedLength || 1;

  const perCatSelected = Math.floor((selectedWeight * totalItems) / selectedLength);
  const perCatOthers = Math.floor((fallbackWeight * totalItems) / otherLength);

  for (const [category, feed] of Object.entries(feedsMap)) {
    const sortedFeed = feed.sort((a, b) => b.pubDate - a.pubDate);

    if (selectedCategories.includes(category)) {
      merged.push(...sortedFeed.slice(0, perCatSelected));
    } else {
      merged.push(...sortedFeed.slice(0, perCatOthers));
    }
  }

  // Shuffle to ensure diverse distribution
  return shuffleArray(merged);
}


// Controller to fetch and merge feeds
// export async function fetchAndMergeFeeds(req, res) {
//   const selectedCategories = req.body.categories; // e.g., ['sports', 'business']
//   try {
//     // Parse all feeds in parallel
//     const allFeeds =  extractAllNewsAsFeedMap();

//     // Map category to feed array
//     const feedsMap = {};
//     Object.keys(rssFeeds).forEach((cat, idx) => {
//       feedsMap[cat] = allFeeds[idx];
//     });

//     console.log("feedsMap", feedsMap);

//     // Merge using weighted logic + shuffle
//     const mergedFeed = weightedMerge(feedsMap, selectedCategories, 50);

//     res.json(mergedFeed);
//   } catch (err) {
//     console.error("Error loading feeds:", err);
//     res.status(500).json({ error: "Failed to fetch feeds" });
//   }
// }

// Controller


export async function fetchAndMergeFeeds(req, res) {
  const selectedCategories = req.body.categories; // ['sports', 'business', etc.]
  const tone = req.body.tone || "original";       // e.g., 'hindi', 'friendly'

  try {
    const allFeeds = await extractAllNewsAsFeedMap(tone);

    // ❌ Exclude 'headlines' from allFeeds
    delete allFeeds["headlines"];

   

    // 🧠 Weighted merge
    const mergedFeed = weightedMerge(allFeeds, selectedCategories, 50);

    res.status(200).json(mergedFeed);
  } catch (err) {
    console.error("❌ Error loading feeds:", err.message);
    res.status(500).json({ error: "Failed to fetch feeds" });
  }
}





function generateId(link) {
  return crypto.createHash("md5").update(link).digest("hex");
}


export async function fetchFeedsMap() {
  const feedEntries = Object.entries(rssFeeds);
  const oneHourAgo = subHours(new Date(), 1);
  console.log("oneHourAgo", oneHourAgo);
  const feedsMap = {};

  const allFeeds = await Promise.all(
    feedEntries.map(([cat, url]) => parseFeed(url, cat))
  );

  for (let i = 0; i < feedEntries.length; i++) {
    const [category] = feedEntries[i];
    const parsedItems = allFeeds[i]
      .map((item) => ({
        ...item,
        id: generateId(item.link),
      }))
      .filter((item) => new Date(item.pubDate) > oneHourAgo);

    if (parsedItems.length === 0) {
      console.log(`⚠️ No recent items found for category "${category}"`);
      continue;
    }

    try {
      // Find summarized articles already in DB for this category
      const latestDoc = await FinalFeedMap.findOne(
        { [`feeds.${category}`]: { $exists: true } },
        { [`feeds.${category}.id`]: 1 }
      ).sort({ timestamp: -1 });

      const existingIds = new Set();

      if (latestDoc?.feeds?.[category]) {
        for (const item of latestDoc.feeds[category]) {
          existingIds.add(item.id);
        }
      }

      const newItems = parsedItems.filter(item => !existingIds.has(item.id));

      if (newItems.length > 0) {
        feedsMap[category] = newItems.sort((a, b) => b.pubDate - a.pubDate);
      } else {
        console.log(`🟡 All articles in category "${category}" already exist`);
      }

    } catch (err) {
      console.warn(`❌ Failed DB lookup for "${category}", using all fresh items`);
      feedsMap[category] = parsedItems;
    }
  }

  return feedsMap;
}
// Prepare AI input from feedsMap
function buildSummarizationInput(feedsMap) {
  const aiInput = [];

  for (const category in feedsMap) {
    feedsMap[category].forEach((item) => {
      aiInput.push({
        id: item.id,
        title: item.title,
        description: item.description,
      });
    });
  }

  return aiInput;
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}



export async function buildSummarization(req, res) {
  try {
    const feedsMap = await fetchFeedsMap();
    const aiInput = buildSummarizationInput(feedsMap);

    console.log("🧮 Total articles to summarize:", aiInput.length);

    const aiChunks = chunkArray(aiInput, 4); // break into 4-item batches
    console.log("📦 Total batches to send:", aiChunks.length);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const allSummarizedItems = [];
    let batchIndex = 1;

    for (const chunk of aiChunks) {
      console.log(`🚀 Processing batch ${batchIndex}/${aiChunks.length}`);
      const prompt = `
You are a summarization assistant for a news app. Given a list of news items (with id, title, and description), return a JSON array where each item contains the same id, and the title and description in 4 tones:

- "original": unchanged
- "hindi": in Hindi 
- "friendly": light and casual
- "hinglish": "Use casual Hinglish — a natural mix of Hindi and English as spoken in daily Indian conversations. Write mostly in English but blend in simple Hindi words or phrases where it feels natural. DO NOT translate entire sentences into Hindi. Example: English: 'India’s cricket team won the series after a tough final match.' → Hinglish: 'India’s cricket team ne finally series jeet li — that last match was too intense!'"

  Summarize in  about 60 words. If the original description text is too short, elaborate it slightly using real-world context or background information, but do not alter or invent facts. 
  ⚠️ IMPORTANT: Always return only valid JSON. No explanation or extra text.
  if you don't get description, then form short one by refering the title.
Here is the input:
${JSON.stringify(chunk, null, 2)}

Format:
[
  {
    "id": "abc123",
    "title": {
      "original": "...",
       "hindi": "...",
      "friendly": "...",
      "hinglish": "..." 
    },
    "description": {
      "original": "...",
      "hindi": "..."
      "friendly": "...",
      "hinglish": "..."  
    }
  }
]
`;

      try {
        const result = await model.generateContent(prompt);
        let responseText = await result.response.text();

        console.log(`📨 Raw AI response (batch ${batchIndex}):`, responseText.slice(0, 500));

        // Clean markdown
        if (responseText.startsWith("```json")) {
          responseText = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        }

        const match = responseText.match(/\[\s*{[\s\S]*?}\s*\]/);
        if (!match) {
          console.warn(`⚠️ Skipped batch ${batchIndex}: No valid JSON found`);
          batchIndex++;
          continue;
        }

        const parsed = JSON.parse(match[0]);
        allSummarizedItems.push(...parsed);
      } catch (err) {
        console.error(`❌ Error in batch ${batchIndex}:`, err.message);
      }

      batchIndex++;
    }

    console.log("✅ Total summarized items:", allSummarizedItems.length);

    // Merge summarized data back into feedsMap by ID
    const summaryMap = Object.fromEntries(
      allSummarizedItems.map((item) => [item.id, item])
    );

    const finalFeedsMap = {};

    for (const [category, articles] of Object.entries(feedsMap)) {
      finalFeedsMap[category] = articles.map((article) => {
        const summary = summaryMap[article.id];
        return summary
          ? {
              ...article,
              title: summary.title,
              description: summary.description,
            }
          : article; // fallback to original if not summarized
      });
    }

    // 🚀 Send final merged result
    // await FinalFeedMap.create({ feeds: finalFeedsMap });
    // console.log("✅ Final feeds saved!");
    const existingDoc = await FinalFeedMap.findOne();

if (!existingDoc) {
  // If it's your first time, create the document
  await FinalFeedMap.create({ feeds: finalFeedsMap });
  console.log("🆕 Created new FinalFeedMap document.");
} else {
  // Otherwise, update the existing document category-wise
  for (const [category, newArticles] of Object.entries(finalFeedsMap)) {
    const existingArticles = existingDoc.feeds.get(category) || [];

    // Create a set of existing article IDs to avoid duplicates
    const existingIds = new Set(existingArticles.map(article => article.id));

    // Filter out new articles that aren't already stored
    const freshArticles = newArticles.filter(article => !existingIds.has(article.id));

    if (freshArticles.length > 0) {
      existingDoc.feeds.set(category, [...existingArticles, ...freshArticles]);
    }
  }

    // ✅ Update the timestamp here
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istTime = new Date(now.getTime() + istOffset);
    
    // ✅ Store IST time in the database
    existingDoc.timestamp = istTime;

  // Save the updated document
  await existingDoc.save();
  console.log("🔁 FinalFeedMap updated with new articles.");
}
    res.status(200).json({ feedsMap: finalFeedsMap });
  } catch (error) {
    console.error("❌ Error during batched AI summarization:", error.message);
    res.status(500).json({ error: "AI summarization failed." });
  }
}

export async function extractAllNewsAsFeedMap(tone = "original") {
  try {
    const doc = await FinalFeedMap.findOne({}).lean();
    if (!doc || !doc.feeds) {
      console.warn("No feeds document found in DB");
      return {};
    }

    const feedMap = {};
    for (const [category, items] of Object.entries(doc.feeds)) {
      feedMap[category] = items.map((item) => ({
        id: item.id,
        title: item.title[tone] || item.title.original,
        description: item.description[tone] || item.description.original,
        link: item.link,
        pubDate: item.pubDate,
        image: item.image,
        category: item.category,
      }));
    }

    return feedMap;
  } catch (err) {
    console.error("❌ Failed to extract feeds:", err.message);
    return {};
  }
}




// Schedule the job to run at the top of every hour
cron.schedule("0 * * * *", async () => {
  console.log("🕐 Running hourly buildSummarization job...");

  try {
    await buildSummarization();
    console.log("✅ Summarization complete!");
  } catch (error) {
    console.error("❌ Summarization job failed:", error.message);
  }
});





// cron.schedule("* * * * *", async () => {
//   console.log("🕐 Running buildSummarization job every minute (test mode)...");

//     await buildSummarization();
//     console.log("✅ Summarization complete!");
  
// });