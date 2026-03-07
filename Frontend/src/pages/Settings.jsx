import React, { useState } from "react";
import { saveGrokApiKey } from "../services/settingsApi";
import Sidebar from "../layouts/sidebar.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await saveGrokApiKey(apiKey);

      await refreshUser();

      setMessage(res.message || "API key saved successfully.");
      setApiKey("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[80px] md:ml-[260px] p-8 md:p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

          {/* API KEY CARD */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add Groq API Key</h2>

            <p className="text-gray-400 text-sm mb-4">
              To use AI features like interview analysis and preparation
              roadmap, add your Groq API key below.
            </p>

            <input
              type="password"
              placeholder="Paste your Groq API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#02000d] border border-white/10 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-500"
            />

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition"
            >
              {loading ? "Saving..." : "Save API Key"}
            </button>

            {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
          </div>

          {/* GUIDE SECTION */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              How to get a Groq API Key
            </h2>

            <ol className="list-decimal list-inside text-gray-400 space-y-2">
              <li>Go to the Groq developer website.</li>
              <li>Create or login to your account.</li>
              <li>Open the API Keys section.</li>
              <li>Generate a new API key.</li>
              <li>Paste the key above and click Save.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
