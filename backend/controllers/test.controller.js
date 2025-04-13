
// Fetch and build feedsMap
async function fetchFeedsMap() {
  const feedEntries = Object.entries(rssFeeds).filter(([cat]) => cat !== "headlines");

  const allFeeds = await Promise.all(
    feedEntries.map(([cat, url]) => parseFeed(url, cat))
  );

  const feedsMap = {};
  feedEntries.forEach(([cat], idx) => {
    const sorted = allFeeds[idx]
      .sort((a, b) => b.pubDate - a.pubDate)
      .slice(0, 8)
      .map((item) => ({
        ...item,
        id: generateId(item.link),
      }));
    feedsMap[cat] = sorted;
  });

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


// export async function buildSummarization(req, res) {
//   try {
//     const feedsMap = await fetchFeedsMap();
//     const aiInput = buildSummarizationInput(feedsMap);
//     const aiChunks = chunkArray(aiInput, 10); // 👈 Break into 10-item batches

//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

//     const allSummarizedItems = [];

//     for (const chunk of aiChunks) {
//       const prompt = `
// You are a summarization assistant for a news app. Given a list of news items (with id, title, and description), return a JSON array where each item contains the same id, and the title and description in 4 tones:

// - "original": unchanged
// - "friendly": light and casual
// - "hinglish": a Hindi-English blend
// - "funny": witty or humorous without distorting facts

// ⚠️ IMPORTANT: Always return only valid JSON. No explanation or extra text.

// Here is the input:
// ${JSON.stringify(chunk, null, 2)}

// Format:
// [
//   {
//     "id": "abc123",
//     "title": {
//       "original": "...",
//       "friendly": "...",
//       "hinglish": "...",
//       "funny": "..."
//     },
//     "description": {
//       "original": "...",
//       "friendly": "...",
//       "hinglish": "...",
//       "funny": "..."
//     }
//   }
// ]
// `;

//       const result = await model.generateContent(prompt);
//       let responseText = await result.response.text();

//       // Strip markdown if present
//       if (responseText.startsWith("```json")) {
//         responseText = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
//       }

//       // Match valid JSON array
//       const match = responseText.match(/\[\s*{[\s\S]*?}\s*\]/);
//       if (!match) {
//         console.warn("⚠️ Skipped one batch: No valid JSON in AI response.");
//         continue;
//       }

//       const parsed = JSON.parse(match[0]);
//       allSummarizedItems.push(...parsed);
//     }

//     res.status(200).json({ summarizedItems: allSummarizedItems});

//   } catch (error) {
//     console.error("Error during batched AI summarization:", error.message);
//     res.status(500).json({ error: "AI summarization failed." });
//   }
// }

export async function buildSummarization(req, res) {
  try {
    const feedsMap = await fetchFeedsMap();
    const aiInput = buildSummarizationInput(feedsMap);

    console.log("🧮 Total articles to summarize:", aiInput.length);

    const aiChunks = chunkArray(aiInput, 4); // 👈 Break into 10-item batches
    console.log("📦 Total batches to send:", aiChunks.length);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const allSummarizedItems = [];

    let batchIndex = 1;

    for (const chunk of aiChunks) {
      console.log(`🚀 Processing batch ${batchIndex}/${aiChunks.length}`);
      const prompt = `
You are a summarization assistant for a news app. Given a list of news items (with id, title, and description), return a JSON array where each item contains the same id, and the title and description in 4 tones:

- "original": unchanged
- "friendly": light and casual
- "hinglish": a Hindi-English blend
- "hindi":in  hindi

⚠️ IMPORTANT: Always return only valid JSON. No explanation or extra text.

Here is the input:
${JSON.stringify(chunk, null, 2)}

Format:
[
  {
    "id": "abc123",
    "title": {
      "original": "...",
      "friendly": "...",
      "hinglish": "...",
      "hindi": "..."
    },
    "description": {
      "original": "...",
      "friendly": "...",
      "hinglish": "...",
      "hindi": "..."
    }
  }
]
`;

      try {
        const result = await model.generateContent(prompt);
        let responseText = await result.response.text();

        console.log(`📨 Raw AI response (batch ${batchIndex}):`, responseText.slice(0, 500)); // Limit log length

        // Strip markdown if present
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

    res.status(200).json({ summarizedItems: allSummarizedItems });
  } catch (error) {
    console.error("❌ Error during batched AI summarization:", error.message);
    res.status(500).json({ error: "AI summarization failed." });
  }
}
