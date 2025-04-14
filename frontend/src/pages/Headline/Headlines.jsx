import React from 'react';
import { TopStoriesList } from '../../components/TopStoriesList';

function Headlines() {
  return (
    <main className="min-h-screen bg-gray-50 pt-5 pb-24 mt-18 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Top Storeis of the Day</h2>
          <TopStoriesList />
        </section>
      </div>
    </main>
  );
}

export default Headlines;