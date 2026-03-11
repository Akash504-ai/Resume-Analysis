"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../layouts/sidebar";
import { useAuth } from "../features/auth/hooks/useAuth";
import {
  MessageCircle,
  Send,
  Smile,
  Users,
  ShieldCheck,
  Zap,
  ChevronDown,
  MoreVertical,
  Trash2,
  UserX,
} from "lucide-react";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeMenu, setActiveMenu] = useState(null); // Track which message menu is open
  const [joined, setJoined] = useState(
    localStorage.getItem("community_joined") === "true",
  );

  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const handleJoin = () => {
    localStorage.setItem("community_joined", "true");
    setJoined(true);
  };

  const deleteForMe = (messageId) => {
    socket.emit("delete-for-me", {
      messageId,
      userId: user.id,
    });
    setActiveMenu(null);
  };

  const deleteForEveryone = (messageId) => {
    socket.emit("delete-for-everyone", {
      messageId,
      userId: user.id,
    });
    setActiveMenu(null);
  };

  useEffect(() => {
    if (!joined) return;
    socket.connect();
    socket.emit("join-community", { userId: user.id });
    socket.on("chat-history", (history) => setMessages(history));
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (!isAtBottom()) setNewMsgIndicator(true);
    });
    socket.on("message-deleted-for-me", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("message-deleted-for-everyone", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, message: "This message was deleted", isDeleted: true }
            : msg,
        ),
      );
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
      socket.off("message-deleted-for-me");
      socket.off("message-deleted-for-everyone");
      socket.disconnect();
    };
  }, [joined]);

  const isAtBottom = () => {
    const el = chatRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMsgIndicator(false);
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !user?.id) return;
    socket.emit("send-message", {
      userId: user.id,
      username: user.username,
      message: input,
    });
    setInput("");
    setShowEmoji(false);
  };

  const formatDateLabel = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    const diff = Math.floor(
      (today.setHours(0, 0, 0, 0) - msgDate.setHours(0, 0, 0, 0)) / 86400000,
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return msgDate.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans overflow-hidden">
      <Sidebar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full" />
      </div>

      <main className="flex-1 ml-20 md:ml-64 flex flex-col h-screen relative z-10">
        <header className="px-8 py-6 border-b border-white/5 bg-[#030014]/50 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(219,39,119,0.3)]">
              <MessageCircle size={24} className="text-white fill-white/20" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">
                Community<span className="text-pink-500">_</span>HUB
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {messages.length * 3 + 12} Nodes Online
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#02000d] bg-gray-800"
                />
              ))}
            </div>
            <span className="text-xs font-black text-gray-500">+ Active</span>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col relative">
            {!joined ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-12 text-center backdrop-blur-3xl"
                >
                  <Zap size={48} className="text-pink-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                    Access Community
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Sync your neural link with the Nexus network to start
                    sharing resources and insights with elite developers.
                  </p>
                  <button
                    onClick={handleJoin}
                    className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-pink-500 hover:text-white transition-all duration-300 uppercase tracking-widest text-sm"
                  >
                    Establish Connection
                  </button>
                </motion.div>
              </div>
            ) : (
              <>
                <div
                  ref={chatRef}
                  className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-hide"
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                      const prev = messages[index - 1];
                      const showDate =
                        !prev ||
                        new Date(prev.createdAt).toDateString() !==
                          new Date(msg.createdAt).toDateString();
                      const isMe = msg.user === user?.id;

                      return (
                        <motion.div
                          key={msg._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col"
                          onMouseLeave={() => setActiveMenu(null)}
                        >
                          {showDate && (
                            <div className="flex items-center gap-4 my-8">
                              <div className="h-px flex-1 bg-white/5" />
                              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                                {formatDateLabel(msg.createdAt)}
                              </span>
                              <div className="h-px flex-1 bg-white/5" />
                            </div>
                          )}

                          <div
                            className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-3`}
                          >
                            {!isMe && (
                              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 uppercase">
                                {msg.username.charAt(0)}
                              </div>
                            )}

                            <div className="relative group flex items-center max-w-[75%] md:max-w-md">
                              {/* HOVER THREE DOTS MENU */}
                              {isMe && !msg.isDeleted && (
                                <div className="absolute -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() =>
                                      setActiveMenu(
                                        activeMenu === msg._id ? null : msg._id,
                                      )
                                    }
                                    className="p-1 hover:text-pink-500 text-gray-500 transition-colors"
                                  >
                                    <MoreVertical size={18} />
                                  </button>

                                  <AnimatePresence>
                                    {activeMenu === msg._id && (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          scale: 0.9,
                                          x: -10,
                                        }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{
                                          opacity: 0,
                                          scale: 0.9,
                                          x: -10,
                                        }}
                                        className="absolute bottom-6 left-0 z-50 w-40 bg-[#030014] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
                                      >
                                        <button
                                          onClick={() =>
                                            deleteForEveryone(msg._id)
                                          }
                                          className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors border-b border-white/5"
                                        >
                                          <Trash2 size={12} /> Delete All
                                        </button>
                                        <button
                                          onClick={() => deleteForMe(msg._id)}
                                          className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-colors"
                                        >
                                          <UserX size={12} /> Delete Me
                                        </button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}

                              <div
                                className={`px-5 py-3 rounded-2xl transition-all duration-300 ${
                                  isMe
                                    ? "bg-gradient-to-br from-pink-600 to-rose-700 text-white rounded-br-none shadow-[0_10px_20px_rgba(219,39,119,0.2)]"
                                    : "bg-white/[0.05] border border-white/5 text-gray-200 rounded-bl-none hover:bg-white/[0.08]"
                                }`}
                              >
                                {!isMe && (
                                  <span className="block text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-1">
                                    {msg.username}
                                  </span>
                                )}
                                <p className="text-sm leading-relaxed font-medium italic">
                                  {msg.isDeleted
                                    ? "This message was deleted"
                                    : msg.message}
                                </p>
                                <span
                                  className={`text-[9px] mt-1.5 block opacity-40 font-bold ${isMe ? "text-right" : "text-left"}`}
                                >
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>

                <AnimatePresence>
                  {newMsgIndicator && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      onClick={scrollToBottom}
                      className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-20"
                    >
                      New Packets Detected <ChevronDown size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <footer className="p-6 bg-[#02000d]/80 backdrop-blur-md border-t border-white/5">
                  <div className="max-w-4xl mx-auto relative flex items-center gap-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowEmoji(!showEmoji)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          showEmoji
                            ? "bg-pink-500 text-white"
                            : "bg-white/5 text-gray-500 hover:text-white"
                        }`}
                      >
                        <Smile size={20} />
                      </button>

                      {showEmoji && (
                        <div className="absolute bottom-16 left-0 z-50 shadow-2xl shadow-black">
                          <Picker
                            data={data}
                            theme="dark"
                            onEmojiSelect={(e) =>
                              setInput((prev) => prev + e.native)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 relative">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Broadcast message to the network..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.08] transition-all"
                      />
                      <button
                        onClick={sendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </div>

          <aside className="hidden lg:flex w-72 border-l border-white/5 bg-[#030014]/30 flex-col p-8">
            <div className="mb-10">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">
                Channel Protocol
              </h3>
              <ul className="space-y-4">
                <ProtocolItem
                  icon={<ShieldCheck size={14} />}
                  text="Civil Dialogue Only"
                />
                <ProtocolItem icon={<Zap size={14} />} text="No Spam Packets" />
                <ProtocolItem
                  icon={<Users size={14} />}
                  text="Share Open Source"
                />
              </ul>
            </div>

            <div className="mt-auto p-6 bg-gradient-to-br from-indigo-600/20 to-pink-600/20 border border-white/5 rounded-3xl">
              <p className="text-xs font-bold text-white mb-2 tracking-tight">
                Community Notice
              </p>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Messages are encrypted via Nexus-V3. Always keep your
                credentials secure.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const ProtocolItem = ({ icon, text }) => (
  <li className="flex items-center gap-3 text-xs font-bold text-gray-400">
    <span className="text-pink-500">{icon}</span>
    {text}
  </li>
);

export default Community;
