//  //server.js
// import express from "express";
// import Parser  from 'rss-parser';
// import  cors from 'cors';
// import path from "path";
// import dotenv from "dotenv";
// import bodyParser from 'body-parser';
// // import {v2 as cloudinary} from "cloudinary"
// import connectMongoDB  from "./db/connectMongoDB.js";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routers/auth.route.js"

// dotenv.config(); //use to read .env content
// // cloudinary.config(
// //     {
// //          cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
// //          api_key:process.env.CLOUDINARY_API_KEY,
// //          api_secret: process.env.CLOUDINARY_API_SECRET
// //      }
// // );

// const app = express();
// // const parser = new Parser();
// app.use(bodyParser.json());
// const PORT=process.env.PORT || 5000
// const __dirname =path.resolve()
// app.use(cors()); // Enable CORS for frontend requests

// app.use(express.json({limit:"5mb"}));  //for parse req.body     also make sure limit limit should not me to large as it can be missuse  and can be attack.
// app.use(express.urlencoded({extended:true})); //to parse from data(urlencoded)
  
// app.use(cookieParser());  // parses cookies attached to the client request object, 
//                           //making them accessible via req.cookies. 

// app.use("/api/auth",authRoutes);
// // app.get('/api/rss/headlines', async (req, res) => {
// // 	try {
// // 	  const feed = await parser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/World.xml');
  
// // 	  const feedData = feed.items.map((item) => {
// // 		// Extract image from various possible fields
// // 		let image = null;
  
// // 		// Check for <enclosure> tag
// // 		if (item.enclosure && item.enclosure.url) {
// // 		  image = item.enclosure.url;
// // 		}

// // 		// Fallback: Check for <img> tag in <description>
// // 		if (!image && item.description) {
// // 		  const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
// // 		  image = imageMatch ? imageMatch[1] : null;
// // 		}
  
// // 		return {
// // 		  title: item.title,
// // 		  link: item.link,
// // 		  description: item.contentSnippet || item.content, // Use plain text if available
// // 		  pubDate: item.pubDate,
// // 		  image, // Add extracted image URL
// // 		};
// // 	  });
  
// // 	  res.json(feedData); // Send the parsed feed data to the frontend
// // 	} catch (error) {
// // 	  console.error('Error fetching RSS feed:', error);
// // 	  res.status(500).json({ error: 'Failed to fetch RSS feed' });
// // 	}
// //   });


// // 🗺️ Category-to-RSS mapping
// // app.get('/api/rss/headlines', async (req, res) => {
// // 	try {
// // 	  const feed = await parser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/World.xml');
  
// // 	  const feedData = feed.items.map((item) => {
// // 		// Extract image from various possible fields
// // 		let image = null;
  
// // 		// Check for <media:content> tag, accommodating for both object and array formats
// // 		if (item['media:content']) {
// // 		  const mediaContent = Array.isArray(item['media:content'])
// // 			? item['media:content'][0]
// // 			: item['media:content'];
// // 		  if (mediaContent['$'] && mediaContent['$'].url) {
// // 			image = mediaContent['$'].url;
// // 		  }
// // 		}
		
// // 		// Check for <enclosure> tag if image is not already set
// // 		if (!image && item.enclosure && item.enclosure.url) {
// // 		  image = item.enclosure.url;
// // 		}
  
// // 		// Fallback: Check for <img> tag in <description>
// // 		if (!image && item.description) {
// // 		  const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
// // 		  image = imageMatch ? imageMatch[1] : null;
// // 		}
// // 		console.log(image);
// // 		return {
// // 		  title: item.title,
// // 		  link: item.link,
// // 		  description: item.contentSnippet || item.content || item.description || '',
// // 		  pubDate: item.pubDate,
// // 		  image, // Add extracted image URL
// // 		};
// // 	  });
  
// // 	  res.json(feedData); // Send the parsed feed data to the frontend
// // 	} catch (error) {
// // 	  console.error('Error fetching RSS feed:', error);
// // 	  res.status(500).json({ error: 'Failed to fetch RSS feed' });
// // 	}
// //   });


// // Custom parser with namespaces
// const parser = new Parser({
//   customFields: {
//     item: [
//       ['media:content', 'mediaContent', { keepArray: true }], // store media:content as `mediaContent`
//     ],
//   },
// });

// app.get('/api/rss/headlines', async (req, res) => {
//   try {
//     const feed = await parser.parseURL('https://feeds.feedburner.com/ndtvnews-top-stories');

//     const feedData = feed.items.map((item) => {
//       let image = null;

//       // Access media:content (now parsed as mediaContent) and extract image URL
//       if (item.mediaContent && item.mediaContent.length > 0) {
//         const media = item.mediaContent[0];
//         if (media && media.$ && media.$.url) {
//           image = media.$.url;
//         }
//       }

//       // Fallback: enclosure
//       if (!image && item.enclosure && item.enclosure.url) {
//         image = item.enclosure.url;
//       }

//       // Fallback: img tag in description
//       if (!image && item.description) {
//         const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
//         image = imageMatch ? imageMatch[1] : null;
//       }

//       return {
//         title: item.title,
//         link: item.link,
//         description: item.contentSnippet || item.content || item.description || '',
//         pubDate: item.pubDate,
//         image,
//       };
//     });

//     res.json(feedData);
//   } catch (error) {
//     console.error('Error fetching RSS feed:', error);
//     res.status(500).json({ error: 'Failed to fetch RSS feed' });
//   }
// });


  
// const weights = {
// 	business: 0.2,
// 	sports: 0.2,
// 	entertainment: 0.2,
// 	world: 0.2,
// 	headlines: 0.2,
//   };
  
//   // 🔀 Shuffle utility
//   function shuffleArray(arr) {
// 	for (let i = arr.length - 1; i > 0; i--) {
// 	  const j = Math.floor(Math.random() * (i + 1));
// 	  [arr[i], arr[j]] = [arr[j], arr[i]];
// 	}
// 	return arr;
//   }
  
//   // 📊 Weighted + shuffled merge
//   function weightedMerge(feedsMap, selectedCategories, totalItems = 50) {
// 	const merged = [];
  
// 	const selectedWeight = 0.85; // 85% from selected
// 	const fallbackWeight = 1 - selectedWeight; // 15% from others
  
// 	const selectedLength = selectedCategories.length;
// 	const otherLength = Object.keys(feedsMap).length - selectedLength || 1;
  
// 	const perCatSelected = Math.floor((selectedWeight * totalItems) / selectedLength);
// 	const perCatOthers = Math.floor((fallbackWeight * totalItems) / otherLength);
  
// 	for (const [category, feed] of Object.entries(feedsMap)) {
// 	  const sortedFeed = feed.sort((a, b) => b.pubDate - a.pubDate);
  
// 	  if (selectedCategories.includes(category)) {
// 		merged.push(...sortedFeed.slice(0, perCatSelected));
// 	  } else {
// 		merged.push(...sortedFeed.slice(0, perCatOthers));
// 	  }
// 	}
  
// 	// Shuffle to ensure diverse distribution
// 	return shuffleArray(merged);
//   }
  
//   const rssFeeds = {
// 	business: 'https://www.cnbctv18.com/commonfeeds/v1/cne/rss/business.xml',
// 	sports: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
// 	entertainment: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
// 	world: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
// 	headlines: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
//   };
  
//   // 🧠 Utility to parse + normalize one feed
//   async function parseFeed(url, categoryName) {
// 	const feed = await parser.parseURL(url);
// 	return feed.items.map((item) => {
// 	  let image = null;
  
// 	  // Access media:content (now parsed as mediaContent) and extract image URL
// 	  if (item.mediaContent && item.mediaContent.length > 0) {
// 		const media = item.mediaContent[0];
// 		if (media && media.$ && media.$.url) {
// 		  image = media.$.url;
// 		}
// 	  }
  
// 	  // Fallback: enclosure
// 	  if (!image && item.enclosure && item.enclosure.url) {
// 		image = item.enclosure.url;
// 	  }
  
// 	  // Fallback: img tag in description
// 	  if (!image && item.description) {
// 		const imageMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
// 		image = imageMatch ? imageMatch[1] : null;
// 	  }
  
// 	  return {
// 		title: item.title,
// 		link: item.link,
// 		description: item.contentSnippet || item.content || '',
// 		pubDate: new Date(item.pubDate),
// 		image,
// 		category: categoryName,
// 	  };
// 	});
//   }
  
//   // 🔥 API to fetch, normalize, merge, and send
//   app.post('/api/rss', async (req, res) => {
// 	const selectedCategories = req.body.categories; // e.g., ['sports', 'business']
// 	try {
// 	  // Parse all feeds in parallel
// 	  const allFeeds = await Promise.all(
// 		Object.entries(rssFeeds).map(([cat, url]) => parseFeed(url, cat))
// 	  );
  
// 	  // Map category to feed array
// 	  const feedsMap = {};
// 	  Object.keys(rssFeeds).forEach((cat, idx) => {
// 		feedsMap[cat] = allFeeds[idx];
// 	  });
  
// 	  // Merge using weighted logic + shuffle
// 	  const mergedFeed = weightedMerge(feedsMap, selectedCategories, 50);
  
// 	  res.json(mergedFeed);
// 	} catch (err) {
// 	  console.error('Error loading feeds:', err);
// 	  res.status(500).json({ error: 'Failed to fetch feeds' });
// 	}
//   });
  
//  if (process.env.NODE_ENV === "production") {         //if we not hit our endpoint run this
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

// app.listen(PORT,()=>{
//     console.log(`server is running on port ${PORT}`);
//     connectMongoDB();
// });



import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routers/auth.route.js";
import rssRoutes from "./routers/rss.route.js" 

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
