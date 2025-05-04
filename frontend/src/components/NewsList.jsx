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
        // Default guest preferences
        let preferredCategories = ["sports", "politics", "market", "entertainment"];
        let preferredTone = "hinglish";
  
        if (authUser?._id) {
          const response = await fetch(`/api/user/preferences/${authUser._id}`);
          const data = await response.json();
          preferredCategories = data.preferredCategories?.length ? data.preferredCategories : preferredCategories;
          preferredTone = data.preferredTone || preferredTone;
        }
  
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
  }, [authUser]);
  
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

