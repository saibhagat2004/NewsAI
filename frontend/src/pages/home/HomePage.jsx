import React from 'react';
import { NewsList } from '../../components/NewsList';
import { useQueryClient } from '@tanstack/react-query';

function HomePage() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(['authUser']);
  const currentTone = authUser?.preferredTone || 'Original'; // fallback

  return (
    <main className="min-h-screen bg-gray-50 pt-5 pb-24 mt-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          {/* Heading + Language row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest News</h2>
        
            <span className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded capitalize">
            Tone: {currentTone}
          </span>
          </div>

          {/* News List */}
          <NewsList authUser={authUser} />
        </section>
      </div>
    </main>
  );
}

export default HomePage;
