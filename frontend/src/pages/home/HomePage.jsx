import React from 'react';
import { NewsList } from '../../components/NewsList';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from "react-router-dom";


const toneOptions = [
  { label: "Original", value: "formal", emoji: "📘" },
  { label: "Friendly", value: "friendly", emoji: "😊" },
  { label: "Hinglish", value: "hinglish", emoji: "😎" },
  { label: "Hindi", value: "hindi", emoji: "🕉️" },
];

function HomePage() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(['authUser']);
  const currentTone = authUser?.preferredTone || 'original'; // fallback

  const matchedTone = toneOptions.find(t => t.value === currentTone);

  return (
    <main className="min-h-screen bg-gray-50 pt-5 pb-24 mt-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          {/* Heading + Language row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest News</h2>

            <span className="inline-flex items-center bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded capitalize">
              {matchedTone ? (
                <>
                   <Link to="/setting" className="block px-4 py-2 hover:bg-gray-100">
                   <span className="hidden sm:inline">Tone:</span>
                    <span className="mr-1">{matchedTone.emoji}</span>
                      {matchedTone.label}
                  </Link>
                </>
              ) : (
                'Original'
              )}
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
