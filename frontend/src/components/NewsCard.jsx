import React, { useState } from 'react';
import { Bookmark, Share2 } from 'lucide-react'; // Using lucide-react icons
import toast from 'react-hot-toast'; // Optional: for user feedback
import { useQueryClient } from '@tanstack/react-query';



export function NewsCard({news}) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(['authUser']);
  const formattedDate = new Date(news.pubDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const [isSaved, setIsSaved] = useState(false);
  const handleSave = async () => {
    if (!authUser?._id) {
      toast.error('Please login to save articles');
      return;
    }
  
    if (!news.link) {
      toast.error('Invalid news item');
      return;
    }
  
    try {
      const res = await fetch('/api/user/save-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authUser._id,
          feedId: news.id,
          feedData: news,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setIsSaved(data.isSaved);
        toast.success(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving article');
    }
  };
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: news.title,
        text: news.description,
        url: news.link,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 pb-10">
        {news.category && (
          <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded capitalize">
            {news.category}
          </span>
        )}
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
        </a>
        <p className="text-gray-600 mb-4">{news.description}</p>
        <small className="text-gray-500">{formattedDate}</small>
      </div>

      {/* Save & Share Icons */}
      <div className="absolute bottom-2 right-2 flex gap-3 pr-2">
        <button
          onClick={handleSave}
          className={`p-1 rounded-full hover:bg-orange-100 transition ${
            isSaved ? 'text-orange-600' : 'text-gray-500'
          }`}
          title="Save"
        >
          <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleShare}
          className="p-1 rounded-full hover:bg-orange-100 text-gray-500 transition"
          title="Share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
