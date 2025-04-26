// import React, { useState, useEffect } from 'react';
// import { NewsCard } from './NewsCard';
// import { useQueryClient } from '@tanstack/react-query';

// export function NewsList() {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const queryClient = useQueryClient();
//   const authUser = queryClient.getQueryData(['authUser']);
//   // Selected categories — you can update this from user preferences later
//   // const selectedCategories = [ 'economy', 'politics','markets']; // Example categories
//   // const selectedTone = 'hinglish'; // You can dynamically change this later (e.g., from user preferences)
//   useEffect(() => {

//     const userPreferences = async () => {
//       try {
//         const response = await fetch(`/api/user/preferences/${authUser?._id}`);
//         const data = await response.json();
//         preferredCategories = data.preferredCategories || []; // Default to empty array if not found
//         preferredTone = data.preferredTone || 'original'; // Default to 'original' if not found
//         return data;
//       } catch (error) {
//         console.error('Error fetching user preferences:', error);
//         return { preferredCategories: [], preferredTone: 'original' }; // Default values
//       }
//     }

//     const fetchRSSFeed = async () => {
//       try {
//         const response = await fetch('/api/rss', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ categories: selectedCategories, tone: selectedTone }),
//         });

//         const data = await response.json();
//         console.log('Fetched News:', data); // Log the news data
//         setNews(data);
//       } catch (error) {
//         console.error('Error fetching RSS feed:', error);
//       } finally {
//         setLoading(false);
//       }
//     };  


//     fetchRSSFeed();
//     userPreferences().then((preferences) => {
//       if (preferences) {
//         setNews((prevNews) => prevNews.filter((item) => preferences.preferredCategories.includes(item.category)));
//       }
//     });
//   }, []);

//   if (loading) return <div className="text-center py-10 text-gray-500">Loading news...</div>;
//   return (

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {news.map((item, index) => (
//         <NewsCard key={index} news={item}/>
//       ))}

//     </div>
//   );
// }








import React, { useState, useEffect } from 'react';
import { NewsCard } from './NewsCard';
import { useQueryClient } from '@tanstack/react-query';

export function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(['authUser']);

  useEffect(() => {
    const fetchUserPreferencesAndNews = async () => {
      try {
        // 1️⃣ Fetch user preferences first
        let preferredCategories = ["headlines"]; // default
        let preferredTone = "original"; // default

        if (authUser?._id) {
          const response = await fetch(`/api/user/preferences/${authUser._id}`);
          const data = await response.json();
          preferredCategories = data.preferredCategories?.length ? data.preferredCategories : ["headlines"];
          preferredTone = data.preferredTone || "original";
        }

        // 2️⃣ Then fetch RSS feed using those preferences
        const feedResponse = await fetch('/api/rss', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: preferredCategories, tone: preferredTone }),
        });

        const feedData = await feedResponse.json();
        setNews(feedData);
      } catch (error) {
        console.error('Error fetching news or preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferencesAndNews();
  }, [authUser]); // Depends on authUser

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading news...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item, index) => (
        <NewsCard key={index} news={item} />
      ))}
    </div>
  );
}

