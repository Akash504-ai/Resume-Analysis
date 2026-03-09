import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../layouts/sidebar";
import { useAuth } from "../features/auth/hooks/useAuth";
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false,
});

const Community = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [joined, setJoined] = useState(
    localStorage.getItem("community_joined") === "true"
  );

  const bottomRef = useRef(null);

  /* JOIN COMMUNITY */

  const handleJoin = () => {
    localStorage.setItem("community_joined", "true");
    setJoined(true);
  };

  /* SOCKET CONNECTION */

  useEffect(() => {
    if (!joined) return;

    socket.connect();

    socket.emit("join-community");

    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [joined]);

  /* AUTO SCROLL */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND MESSAGE */

  const sendMessage = () => {
    if (!input.trim()) return;

    if (!user || !user.id) {
      console.log("User not ready yet:", user);
      return;
    }

    socket.emit("send-message", {
      userId: user.id,
      username: user.username,
      message: input,
    });

    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 font-sans">
      <Sidebar />

      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 relative">
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Header */}

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(219,39,119,0.4)]">
              <MessageCircle size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Community Channel
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Connect, share resources, and learn with other students.
              </p>
            </div>
          </div>

          {/* COMMUNITY RULES SCREEN */}

          {!joined ? (
            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-10 text-center backdrop-blur-xl shadow-xl">

              <h2 className="text-2xl font-bold mb-6 text-white">
                Welcome to the Nexus Community 🚀
              </h2>

              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                This community is a place for students to learn, collaborate,
                and help each other grow.
              </p>

              <div className="text-left max-w-lg mx-auto text-gray-400 text-sm space-y-3 mb-10">
                <p>• Be respectful to everyone.</p>
                <p>• No spam or promotions.</p>
                <p>• No hate speech or harassment.</p>
                <p>• Share useful resources.</p>
                <p>• Help other students when possible.</p>
                <p>• Keep discussions related to learning.</p>
              </div>

              <button
                onClick={handleJoin}
                className="px-10 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all"
              >
                Join Community
              </button>

            </div>
          ) : (

            /* CHAT UI */

            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl shadow-xl flex flex-col h-[600px]">

              {/* Messages */}

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">

                {messages.map((msg, index) => {

                  const isMe = msg.user === user?.id;

                  return (
                    <div
                      key={index}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >

                      <div
                        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm shadow-md ${
                          isMe
                            ? "bg-pink-600 text-white"
                            : "bg-white/10 text-gray-200"
                        }`}
                      >

                        {!isMe && (
                          <p className="text-[10px] text-gray-400 mb-1 font-bold">
                            {msg.username}
                          </p>
                        )}

                        <p>{msg.message}</p>

                      </div>

                    </div>
                  );
                })}

                <div ref={bottomRef} />

              </div>

              {/* Input */}

              <div className="mt-4 flex gap-3">

                <input
                  value={input}
                  disabled={!user}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    user
                      ? "Share something with the community..."
                      : "Loading user..."
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                  onClick={sendMessage}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all"
                >
                  Send
                </button>

              </div>

            </div>

          )}

        </div>
      </main>
    </div>
  );
};

export default Community;