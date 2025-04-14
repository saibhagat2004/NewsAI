import React, { useEffect, useState } from 'react';
import { SaveArticalCard } from './SaveArticalCard'; // Assuming NewsCard is in the same folder
import toast from 'react-hot-toast';

export function SavedFeed({ authUser }) {
  const [savedFeeds, setSavedFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
 console.log("authUser", authUser.authUser?._id);
  useEffect(() => {
    const fetchSavedFeeds = async () => {
      try {
        const res = await fetch(`/api/user/get-saved-feeds/${authUser.authUser?._id}`);
        const data = await res.json();
        console.log("data", data);

        if (res.ok) {
          setSavedFeeds(data);
        } else {
          toast.error(data.message || 'Failed to fetch saved feeds');
        }
      } catch (error) {
        console.error('Error fetching saved feeds:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (authUser.authUser?._id) {
      fetchSavedFeeds();
    }
  }, [authUser]);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading saved posts...</div>;
  }

  if (savedFeeds.length === 0) {
    return <div className="text-center py-10 text-gray-600">No saved posts found.</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {savedFeeds.map((feed) => (
        <SaveArticalCard key={feed._id} news={feed.feedData} authUser={authUser} />
      ))}
    </div>
  );
}
