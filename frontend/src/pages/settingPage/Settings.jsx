import React, { useState, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';
import tost from "react-hot-toast";
const toneOptions = [
  { label: "Original", value: "formal", emoji: "📘" },
  { label: "Friendly", value: "friendly", emoji: "😊" },
  { label: "Hinglish", value: "hinglish", emoji: "😎" },
  { label: "Hindi", value: "hindi", emoji: "🕉️" },
];

const allCategories = [
  "sports",
  "markets",
  "economy",
  "technology",
  "health",
  "entertainment",
  "politics",
  "world",
];

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(['authUser']);
  console.log("Auth User:", authUser);

  const [tone, setTone] = useState("formal");
  const [selectedCategories, setSelectedCategories] = useState(authUser?.preferredCategories || []);



  // Load settings from localStorage or API
  useEffect(() => {
    const savedTone = localStorage.getItem("tone");
    const savedCategories = JSON.parse(localStorage.getItem("categories") || "[]");

    if (savedTone) setTone(savedTone);
    if (savedCategories.length) setSelectedCategories(savedCategories);
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const saveSettings = async () => {
    try {
      // Save locally too (optional)
      localStorage.setItem("tone", tone);
      localStorage.setItem("categories", JSON.stringify(selectedCategories));
  
      const userId = authUser?._id; // Replace this if you use auth context or cookies
      if (!userId) {
        tost.error("Please log in to save preferences.");
        return;
      }
  
      const res = await fetch("/api/user/update-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tone , categories: selectedCategories }),
      });
  
      const data = await res.json();
      if (res.ok) {
        tost.success("Preferences saved!");
  
        // Invalidate the authUser cache so it fetches fresh data
        queryClient.invalidateQueries(['authUser']);
      } else {
        tost.error("Failed to save preferences: " + data.error);
      }
    } catch (err) {
      console.error("Error saving preferences:", err);
      tost.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-20">
      <h2 className="text-2xl font-bold mb-4">🛠️ Settings</h2>

      {/* Tone selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🗣️ Tone Preference</h3>
        <div className="flex flex-wrap gap-3">
          {toneOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTone(option.value)}
              className={`px-4 py-2 rounded-full border transition ${
                tone === option.value
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>
      </div>

     {/* Category selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🗂️ Select Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`text-sm px-3 py-2 rounded-full border capitalize transition ${
                selectedCategories.includes(cat)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="text-right">
        <button
          onClick={saveSettings}
          className="bg-black text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition"
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
