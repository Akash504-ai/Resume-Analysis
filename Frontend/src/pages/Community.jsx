import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../layouts/sidebar";
import { useAuth } from "../features/auth/hooks/useAuth";
import { MessageCircle } from "lucide-react";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false,
});

const Community = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [newMsgIndicator, setNewMsgIndicator] = useState(false);

  const [joined, setJoined] = useState(
    localStorage.getItem("community_joined") === "true"
  );

  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  /* JOIN COMMUNITY */

  const handleJoin = () => {
    localStorage.setItem("community_joined", "true");
    setJoined(true);
  };

  /* SOCKET */

  useEffect(() => {
    if (!joined) return;

    socket.connect();
    socket.emit("join-community");

    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);

      if (!isAtBottom()) {
        setNewMsgIndicator(true);
      }
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [joined]);

  /* CHECK SCROLL POSITION */

  const isAtBottom = () => {
    const el = chatRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMsgIndicator(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  /* SEND MESSAGE */

  const sendMessage = () => {
    if (!input.trim()) return;

    if (!user || !user.id) return;

    socket.emit("send-message", {
      userId: user.id,
      username: user.username,
      message: input,
    });

    setInput("");
  };

  /* DATE FORMAT */

  const formatDateLabel = (date) => {
    const today = new Date();
    const msgDate = new Date(date);

    const diff =
      (today.setHours(0, 0, 0, 0) - msgDate.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 font-sans">
      <Sidebar />

      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 relative">

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center">
              <MessageCircle size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                Community Channel
              </h1>
              <p className="text-gray-500 text-sm">
                Connect, share resources, and learn with other students.
              </p>
            </div>
          </div>

          {/* RULES */}

          {!joined ? (
            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-10 text-center">

              <h2 className="text-2xl font-bold mb-6">
                Welcome to the Nexus Community 🚀
              </h2>

              <p className="text-gray-400 mb-8">
                Learn together, share resources and help other developers grow.
              </p>

              <button
                onClick={handleJoin}
                className="px-10 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl"
              >
                Join Community
              </button>

            </div>
          ) : (

            /* CHAT */

            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 flex flex-col h-[600px]">

              {/* MESSAGES */}

              <div
                ref={chatRef}
                className="flex-1 overflow-y-auto space-y-4 pr-2"
              >

                {messages.map((msg, index) => {
                  const prev = messages[index - 1];
                  const showDate =
                    !prev ||
                    new Date(prev.createdAt).toDateString() !==
                      new Date(msg.createdAt).toDateString();

                  const isMe = msg.user === user?.id;

                  return (
                    <React.Fragment key={index}>

                      {showDate && (
                        <div className="text-center text-xs text-gray-500 my-4">
                          {formatDateLabel(msg.createdAt)}
                        </div>
                      )}

                      <div
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >

                        <div
                          className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm ${
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

                          <span className="text-[10px] opacity-70 block mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}

                <div ref={bottomRef} />

              </div>

              {/* NEW MESSAGE INDICATOR */}

              {newMsgIndicator && (
                <button
                  onClick={scrollToBottom}
                  className="self-center mb-2 text-xs bg-pink-600 px-4 py-1 rounded-full"
                >
                  New messages ↓
                </button>
              )}

              {/* INPUT */}

              <div className="mt-4 flex gap-3 items-center relative">

                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="text-xl"
                >
                  😊
                </button>

                {showEmoji && (
                  <div className="absolute bottom-14">
                    <Picker
                      data={data}
                      onEmojiSelect={(e) =>
                        setInput((prev) => prev + e.native)
                      }
                    />
                  </div>
                )}

                <input
                  value={input}
                  disabled={!user}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share something with the community..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                  onClick={sendMessage}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl"
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