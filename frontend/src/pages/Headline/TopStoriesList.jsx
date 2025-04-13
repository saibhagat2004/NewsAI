import React, { useState, useEffect } from 'react';
import { NewsCard } from '../../components/NewsCard';

export function TopStoriesList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch('/api/rss/headlines', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSSFeed();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading news...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item, index) => (
        <NewsCard key={index} news={item} />
      ))}
    </div>
  );
}
