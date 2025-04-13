import React from 'react';
import { NewsList } from '../../components/NewsList';

function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-5 pb-24 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Latest News</h2>
          <NewsList />
        </section>
      </div>
    </main>
  );
}

export default HomePage;