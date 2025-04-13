// // import { Home, Newspaper } from 'lucide-react';
// // import { useState } from 'react';

// // export function Navbar() {
// //   const [activeTab, setActiveTab] = useState('for-you');

// //   return (
// //     <>
// //       {/* Desktop Navbar */}
// //       <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
// //         <div className="max-w-7xl mx-auto px-4">
// //           <div className="flex items-center justify-between h-16">
// //             <div className="flex items-center">
// //               <h1 className="text-2xl font-bold text-blue-600">Bharat Brief</h1>
// //             </div>
// //             <div className="flex space-x-8">
// //               <button
// //                 onClick={() => setActiveTab('for-you')}
// //                 className={`px-3 py-2 text-sm font-medium ${
// //                   activeTab === 'for-you'
// //                     ? 'text-blue-600 border-b-2 border-blue-600'
// //                     : 'text-gray-500 hover:text-gray-700'
// //                 }`}
// //               >
// //                 For You
// //               </button>
// //               <button
// //                 onClick={() => setActiveTab('headlines') }
// //                 className={`px-3 py-2 text-sm font-medium ${
// //                   activeTab === 'headlines'
// //                     ? 'text-blue-600 border-b-2 border-blue-600'
// //                     : 'text-gray-500 hover:text-gray-700'
// //                 }`}
// //               >
// //                 Headlines
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Mobile Bottom Navigation */}
// //       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
// //         <div className="grid grid-cols-2">
// //           <button
// //             onClick={() => setActiveTab('for-you')}
// //             className={`flex flex-col items-center justify-center py-3 ${
// //               activeTab === 'for-you'
// //                 ? 'text-blue-600'
// //                 : 'text-gray-500 hover:text-gray-700'
// //             }`}
// //           >
// //             <Home size={24} />
// //             <span className="text-xs mt-1">For You</span>
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('headlines')}
// //             className={`flex flex-col items-center justify-center py-3 ${
// //               activeTab === 'headlines'
// //                 ? 'text-blue-600'
// //                 : 'text-gray-500 hover:text-gray-700'
// //             }`}
// //           >
// //             <Newspaper size={24} />
// //             <span className="text-xs mt-1">Headlines</span>
// //           </button>
// //         </div>
// //       </nav>
// //     </>
// //   );
// // }

// import { Home, Newspaper } from 'lucide-react';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// export function Navbar() {
//   const [activeTab, setActiveTab] = useState('for-you');

//   return (
//     <>
//       {/* Desktop Navbar */}
//       <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-blue-600">Bharat Brief</h1>
//             </div>
//             <div className="flex space-x-8">
//               <Link to="/">
//                 <button
//                   onClick={() => setActiveTab('for-you')}
//                   className={`px-3 py-2 text-sm font-medium ${
//                     activeTab === 'for-you'
//                       ? 'text-blue-600 border-b-2 border-blue-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   For You
//                 </button>
//               </Link>
//               <Link to="/headlines">
//                 <button
//                   onClick={() => setActiveTab('headlines')}
//                   className={`px-3 py-2 text-sm font-medium ${
//                     activeTab === 'headlines'
//                       ? 'text-blue-600 border-b-2 border-blue-600'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   Headlines
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Bottom Navigation */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
//         <div className="grid grid-cols-2">
//           <Link to="/">
//             <button
//               onClick={() => setActiveTab('for-you')}
//               className={`flex flex-col items-center justify-center py-3 ${
//                 activeTab === 'for-you'
//                   ? 'text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Home size={24} />
//               <span className="text-xs mt-1">For You</span>
//             </button>
//           </Link>
//           <Link to="/headlines">
//             <button
//               onClick={() => setActiveTab('headlines')}
//               className={`flex flex-col items-center justify-center py-3 ${
//                 activeTab === 'headlines'
//                   ? 'text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Newspaper size={24} />
//               <span className="text-xs mt-1">Headlines</span>
//             </button>
//           </Link>
//         </div>
//       </nav>
//     </>
//   );
// }