import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Avatar from "../../../public/avatars/boy1.png";
import { Home, Newspaper, Bookmark } from 'lucide-react';

const Navbar = ({ authUser, isGuest, setIsGuest }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


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
    // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  return (
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
          <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-circle bg-white opacity-90 p-0 border border-gray-300"
      >
        <img
          src={authUser?.profilePicture || Avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute right-0 mt-3 w-52 p-2 bg-white opacity-90 shadow rounded-box z-50">
          {/* <li>
            <Link to="/DashBoardPage" className="block px-4 py-2 hover:bg-gray-100">
              Profile
            </Link>
          </li> */}
          <li>
            <Link to="/setting" className="block px-4 py-2 hover:bg-gray-100">
            <a className="block px-4 py-2 hover:bg-gray-100">Settings</a>
            </Link>
            
          </li>
          <li>
            <a
              className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </a>
          </li>
        </ul>
      )}
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