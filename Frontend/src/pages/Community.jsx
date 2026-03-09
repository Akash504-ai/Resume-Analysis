import React from "react";
import CommunityChat from "../../components/ui/CommunityChat";

export default function Community() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="ml-20 md:ml-64 min-h-screen p-6 text-white">
      
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <CommunityChat user={user} />

    </div>
  );
}