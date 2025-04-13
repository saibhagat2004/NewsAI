// import React from 'react';

// export function NewsCard({ news }) {
//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden">
//       {/* Display image if available */}
//       {news.image && (
//         <img
//           src={news.image}
//           alt={news.title}
//           className="w-full h-48 object-cover"
//         />
//       )}
//       <div className="p-4">
//         <a
//           href={news.link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline"
//         >
//           <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
//         </a>
//         <p className="text-gray-600 mb-4">{news.description}</p>
        
//         <small className="text-gray-500">{news.pubDate}</small>
//       </div>
//     </div>
//   );
// }

import React from 'react';

export function NewsCard({ news }) {
  const formattedDate = new Date(news.pubDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
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
    </div>
  );
}
