import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Avatar from "../../../public/avatars/boy1.png";
import { Home, Newspaper, Bookmark } from 'lucide-react';

const Navbar = ({ authUser, isGuest, setIsGuest }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(false);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('for-you');

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout Failed");
    },
  });

  const handleLogout = (e) => {
    e.preventDefault();
    if (isGuest) {
      setIsGuest(false);
      navigate(`/login`);
    }
    logout();
  };

  return (
//     <nav className="bg-white px-8 py-1 flex justify-between items-center relative shadow-md">
//       {/* Left Side: Logo */}
//       <div className="text-black text-3xl font-extrabold">
//         NewsAI
//       </div>
//        {/* Avatar Icon */}
//        <div className="dropdown dropdown-end">
//               <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                 <div className="w-10 rounded-full">
//                   <img
//                     src={authUser?.profilePicture || Avatar}
//                     alt="Avatar"
//                     className="w-10 h-10 rounded-full border border-gray-300"
//                   />
//                 </div>
//               </div>
//               <ul
//                 tabIndex={0}
//                 className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
//               >
//                 <li>
//                   <Link to="/DashBoardPage" className="justify-between text-gray-700 hover:text-black">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="text-gray-700 hover:text-black">Settings</a>
//                 </li>
//                 <li>
//                   <a
//                     className="text-gray-700 hover:text-black cursor-pointer"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </a>
//                 </li>
//               </ul>
//             </div>

      
//       {/* Desktop Navbar */}
//       <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <div className="text-black text-3xl font-extrabold">
//               NewsAI
//             </div>
//             <div className="flex items-center space-x-8">
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

//             {/* Avatar Icon */}
//             <div className="dropdown dropdown-end">
//               <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                 <div className="w-10 rounded-full">
//                   <img
//                     src={authUser?.profilePicture || Avatar}
//                     alt="Avatar"
//                     className="w-10 h-10 rounded-full border border-gray-300"
//                   />
//                 </div>
//               </div>
//               <ul
//                 tabIndex={0}
//                 className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
//               >
//                 <li>
//                   <Link to="/DashBoardPage" className="justify-between text-gray-700 hover:text-black">
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <a className="text-gray-700 hover:text-black">Settings</a>
//                 </li>
//                 <li>
//                   <a
//                     className="text-gray-700 hover:text-black cursor-pointer"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Bottom Navigation */}
// <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
//   <div className="grid grid-cols-3 justify-items-center">
//     <Link to="/">
//       <button
//         onClick={() => setActiveTab('for-you')}
//         className={`flex flex-col items-center justify-center py-3 ${
//           activeTab === 'for-you'
//             ? 'text-blue-600'
//             : 'text-gray-500 hover:text-gray-700'
//         }`}
//       >
//         <Home size={24} className="mb-1" />
//         <span className="text-xs">For You</span>
//       </button>
//     </Link>
//     <Link to="/headlines">
//       <button
//         onClick={() => setActiveTab('headlines')}
//         className={`flex flex-col items-center justify-center py-3 ${
//           activeTab === 'headlines'
//             ? 'text-blue-600'
//             : 'text-gray-500 hover:text-gray-700'
//         }`}
//       >
//         <Newspaper size={24} className="mb-1" />
//         <span className="text-xs">Headlines</span>
//       </button>
//     </Link>
//     <Link to="/saved-news">
//       <button
//         onClick={() => setActiveTab('saved-news')}
//         className={`flex flex-col items-center justify-center py-3 ${
//           activeTab === 'saved-news'
//             ? 'text-blue-600'
//             : 'text-gray-500 hover:text-gray-700'
//         }`}
//       >
//         <Bookmark size={24} className="mb-1" />
//         <span className="text-xs">Saved</span>
//       </button>
//     </Link>
//   </div>
// </nav>
//     </nav>
//   );
// };


  <>
    {/* Top Navbar (All devices) */}
    <nav className="bg-white px-6 py-3  flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Left: Logo */}
      <div className="text-3xl font-extrabold text-black">NewsAI</div>

      {/* Center: Nav Links (hidden on mobile) */}
      <div className="hidden md:flex space-x-8 text-base">
        <Link to="/">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`${
              activeTab === "for-you"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            For You
          </button>
        </Link>
        <Link to="/headlines">
          <button
            onClick={() => setActiveTab("headlines")}
            className={`${
              activeTab === "headlines"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Headlines
          </button>
        </Link>
        <Link to="/saved-news">
          <button
            onClick={() => setActiveTab("saved-news")}
            className={`${
              activeTab === "saved-news"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Saved
          </button>
        </Link>
      </div>

      {/* Right: Avatar (dropdown for both desktop & mobile) */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              src={authUser?.profilePicture || Avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link to="/DashBoardPage">Profile</Link>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </nav>

    {/* Mobile Bottom Navbar */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 flex justify-around z-50">
      <Link to="/">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`flex flex-col items-center text-sm ${
            activeTab === "for-you" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Home size={22} />
          For You
        </button>
      </Link>
      <Link to="/headlines">
        <button
          onClick={() => setActiveTab("headlines")}
          className={`flex flex-col items-center text-sm ${
            activeTab === "headlines" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Newspaper size={22} />
          Headlines
        </button>
      </Link>
      <Link to="/saved-news">
        <button
          onClick={() => setActiveTab("saved-news")}
          className={`flex flex-col items-center text-sm ${
            activeTab === "saved-news" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Bookmark size={22} />
          Saved
        </button>
      </Link>
    </div>
  </>
);
};

export default Navbar;