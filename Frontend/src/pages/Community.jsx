"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
  Reply as ReplyIcon,
  X,
  CornerDownRight,
  Pin,
  Image as ImageIcon,
  Search,
  Loader2,
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
  const [activeMenu, setActiveMenu] = useState(null);
  const [joined, setJoined] = useState(
    localStorage.getItem("community_joined") === "true",
  );
  const [replyingTo, setReplyingTo] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);

  // New Feature States
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const chatRef = useRef(null);
  const bottomRef = useRef(null);
  const isInitialLoad = useRef(true);
  const typingTimeoutRef = useRef(null);

  const handleJoin = () => {
    localStorage.setItem("community_joined", "true");
    setJoined(true);
  };

  const deleteForMe = (messageId) => {
    socket.emit("delete-for-me", { messageId, userId: user.id });
    setActiveMenu(null);
  };

  const deleteForEveryone = (messageId) => {
    socket.emit("delete-for-everyone", { messageId, userId: user.id });
    setActiveMenu(null);
  };

  // 2️⃣ Message Reactions Logic
  const addReaction = (messageId, emoji) => {
    socket.emit("add-reaction", { messageId, emoji, userId: user.id });
  };

  const scrollToMessage = (msgId) => {
    const targetId = `msg-${msgId}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.transition = "all 0.5s ease";
      element.style.backgroundColor = "rgba(236, 72, 153, 0.2)";
      setTimeout(() => {
        element.style.backgroundColor = "transparent";
      }, 1000);
    }
  };

  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setNewMsgIndicator(false);
  }, []);

  const isAtBottom = useCallback(() => {
    const el = chatRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop <= el.clientHeight + 200;
  }, []);

  // 3️⃣ Typing Indicator Emitter
  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isTyping) {
      socket.emit("typing-start", { username: user.username });
      setIsTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing-stop", { username: user.username });
      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    if (!joined) return;
    socket.connect();
    socket.emit("join-community", { userId: user.id });

    socket.on("chat-history", (history) => {
      setMessages(history);
      const pinned = history.find((m) => m.isPinned);
      if (pinned) setPinnedMessage(pinned);
      setTimeout(() => {
        scrollToBottom("auto");
        isInitialLoad.current = false;
      }, 100);
    });

    // 4️⃣ Online Users Listener
    socket.on("online-users", (users) => setOnlineUsers(users));

    // 3️⃣ Typing Listener
    socket.on("user-typing", (username) => {
      if (username !== user.username) setTypingUser(username);
    });
    socket.on("user-stop-typing", () => setTypingUser(null));

    // 2️⃣ Reaction Listener
    socket.on("reaction-updated", ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg,
        ),
      );
    });

    // 6️⃣ Search Results Listener
    socket.on("search-results", (results) => setSearchResults(results));

    socket.on("message-pinned", (message) => {
      setPinnedMessage(message);
      setMessages((prev) =>
        prev.map((m) => ({ ...m, isPinned: m._id === message._id })),
      );
    });

    socket.on("message-unpinned", () => {
      setPinnedMessage(null);
      setMessages((prev) => prev.map((m) => ({ ...m, isPinned: false })));
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (isAtBottom()) {
        setTimeout(() => scrollToBottom("smooth"), 50);
      } else {
        setNewMsgIndicator(true);
      }
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
      setPinnedMessage((prev) => (prev?._id === messageId ? null : prev));
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
      socket.off("message-deleted-for-me");
      socket.off("message-deleted-for-everyone");
      socket.off("message-pinned");
      socket.off("message-unpinned");
      socket.off("reaction-updated");
      socket.off("user-typing");
      socket.off("user-stop-typing");
      socket.off("online-users");
      socket.off("search-results");
      socket.disconnect();
    };
  }, [joined, user.id, user.username, scrollToBottom, isAtBottom]);

  // 1️⃣ Image Upload + Send Logic
  const sendMessage = async () => {
    if ((!input.trim() && !image) || !user?.id) return;

    let imageUrl = null;
    if (image) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", image);

      try {
        // Replace with your actual upload API endpoint
        // const res = await uploadAPI(formData);
        // imageUrl = res.url;
        const res = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        imageUrl = data.url;
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }

    // 5️⃣ Mentions Extraction
    const mentions = input.match(/@(\w+)/g)?.map((m) => m.substring(1)) || [];

    socket.emit("send-message", {
      userId: user.id,
      username: user.username,
      message: input,
      type: imageUrl ? "image" : "text",
      imageUrl: imageUrl,
      mentions: mentions,
      replyTo: replyingTo
        ? {
            _id: replyingTo._id,
            username: replyingTo.username,
            message: replyingTo.message,
          }
        : null,
    });

    setInput("");
    setImage(null);
    setShowEmoji(false);
    setReplyingTo(null);
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

  // 5️⃣ Mention Highlighting Component
  const FormattedMessage = ({ text }) => {
    const parts = text.split(/(@\w+)/g);
    return (
      <span>
        {parts.map((part, i) =>
          part.startsWith("@") ? (
            <span
              key={i}
              className="text-pink-400 font-bold bg-pink-500/10 px-1 rounded"
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans overflow-hidden">
      <Sidebar />

      <div className="fixed inset-0 pointer-events-none -z-10">
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
                  {/* 4️⃣ Online Count Display */}
                  {onlineUsers.length > 0
                    ? onlineUsers.length
                    : messages.length + 12}{" "}
                  Nodes Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* 6️⃣ Message Search Trigger */}
            <div
              className={`flex items-center transition-all ${showSearch ? "w-48 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
            >
              <input
                type="text"
                placeholder="Scan history..."
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-pink-500"
                onChange={(e) =>
                  socket.emit("search-messages", { query: e.target.value })
                }
              />
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Search size={18} />
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex -space-x-3">
                {onlineUsers.slice(0, 4).map((u, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#02000d] bg-indigo-600 flex items-center justify-center text-[10px] font-bold"
                  >
                    {u.username?.charAt(0) || "U"}
                  </div>
                ))}
              </div>
              <span className="text-xs font-black text-gray-500 uppercase">
                +{onlineUsers.length} Online
              </span>
            </div>
          </div>
        </header>

        {/* Pinned Message UI Bar */}
        <AnimatePresence>
          {pinnedMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onClick={() => scrollToMessage(pinnedMessage._id)}
              className="bg-yellow-500/5 border-b border-yellow-500/20 px-8 py-3 text-xs text-yellow-400/80 cursor-pointer flex items-center justify-between group/pin backdrop-blur-md"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Pin size={14} className="text-yellow-500 fill-yellow-500/20" />
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-black uppercase tracking-widest text-[10px] text-yellow-500">
                    Pinned:
                  </span>
                  <span className="truncate opacity-80">
                    {pinnedMessage.message}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view
              </span>
            </motion.div>
          )}
        </AnimatePresence>

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
                    Establish a secure node connection to the Nexus network.
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
                  className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-hide will-change-transform"
                >
                  <AnimatePresence initial={false}>
                    {(searchResults ?? messages).map((msg, index) => {
                      const prev = messages[index - 1];
                      const showDate =
                        !prev ||
                        new Date(prev.createdAt).toDateString() !==
                          new Date(msg.createdAt).toDateString();
                      const isMe = msg.user?.toString() === user?.id;

                      return (
                        <div
                          key={msg._id || index}
                          id={`msg-${msg._id}`}
                          className="flex flex-col"
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
                                {msg.username?.charAt(0)}
                              </div>
                            )}

                            <div
                              className="relative group flex items-center max-w-[75%] md:max-w-md"
                              onMouseLeave={() => setActiveMenu(null)}
                            >
                              {!msg.isDeleted && (
                                <div
                                  className={`absolute ${isMe ? "-left-10" : "-right-10"} opacity-0 group-hover:opacity-100 transition-opacity z-30`}
                                >
                                  <button
                                    onClick={() =>
                                      setActiveMenu(
                                        activeMenu === msg._id ? null : msg._id,
                                      )
                                    }
                                    className="p-2 hover:text-pink-500 text-gray-500 transition-colors"
                                  >
                                    <MoreVertical size={18} />
                                  </button>

                                  <AnimatePresence>
                                    {activeMenu === msg._id && (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          scale: 0.9,
                                          y: 10,
                                        }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className={`absolute bottom-8 ${isMe ? "left-0" : "right-0"} w-40 bg-[#030014]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-2xl z-50`}
                                      >
                                        {/* 2️⃣ Reaction Quick Bar */}
                                        <div className="flex justify-around p-2 border-b border-white/5">
                                          {["🔥", "❤️", "👍", "😮"].map(
                                            (emoji) => (
                                              <button
                                                key={emoji}
                                                onClick={() => {
                                                  addReaction(msg._id, emoji);
                                                  setActiveMenu(null);
                                                }}
                                                className="hover:scale-125 transition-transform"
                                              >
                                                {emoji}
                                              </button>
                                            ),
                                          )}
                                        </div>
                                        <button
                                          onClick={() => {
                                            msg.isPinned
                                              ? socket.emit("unpin-message", {
                                                  messageId: msg._id,
                                                })
                                              : socket.emit("pin-message", {
                                                  messageId: msg._id,
                                                });
                                            setActiveMenu(null);
                                          }}
                                          className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-yellow-400 hover:bg-white/5 border-b border-white/5"
                                        >
                                          <Pin size={12} />{" "}
                                          {msg.isPinned ? "Unpin" : "Pin"}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setReplyingTo(msg);
                                            setActiveMenu(null);
                                          }}
                                          className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white/5 border-b border-white/5"
                                        >
                                          <ReplyIcon size={12} /> Reply
                                        </button>
                                        {isMe && (
                                          <button
                                            onClick={() =>
                                              deleteForEveryone(msg._id)
                                            }
                                            className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
                                          >
                                            <Trash2 size={12} /> Delete
                                          </button>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}

                              <div
                                className={`px-5 py-3 rounded-2xl transition-all duration-300 ${
                                  isMe
                                    ? "bg-gradient-to-br from-pink-600 to-rose-700 text-white rounded-br-none"
                                    : "bg-white/[0.05] border border-white/5 text-gray-200 rounded-bl-none"
                                } ${msg.isPinned ? "ring-1 ring-yellow-500/50" : ""}`}
                              >
                                {!isMe && (
                                  <span className="block text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-1">
                                    {msg.username}
                                  </span>
                                )}

                                {msg.replyTo && (
                                  <div
                                    onClick={() =>
                                      scrollToMessage(msg.replyTo._id)
                                    }
                                    className="mb-2 p-2 bg-black/30 border-l-2 border-indigo-500 rounded-lg cursor-pointer"
                                  >
                                    <p className="text-[9px] font-black text-indigo-400 uppercase">
                                      {msg.replyTo.username}
                                    </p>
                                    <p className="text-[10px] text-white/50 truncate italic">
                                      {msg.replyTo.message}
                                    </p>
                                  </div>
                                )}

                                {/* 1️⃣ Image Rendering */}
                                {msg.imageUrl && (
                                  <img
                                    src={msg.imageUrl}
                                    alt="Shared content"
                                    className="max-w-full rounded-lg mb-2 border border-white/10"
                                  />
                                )}

                                <p className="text-sm leading-relaxed font-medium">
                                  {msg.isDeleted ? (
                                    <span className="opacity-40 italic">
                                      Removed
                                    </span>
                                  ) : (
                                    <FormattedMessage text={msg.message} />
                                  )}
                                </p>

                                {/* 🔴 AI Moderation Label */}
                                {msg.moderation === "spam" && (
                                  <div className="mt-1 text-[10px] text-red-400 font-bold uppercase tracking-wider">
                                    ⚠ Spam detected
                                  </div>
                                )}

                                {msg.moderation === "toxic" && (
                                  <div className="mt-1 text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                                    ⚠ Toxic message detected
                                  </div>
                                )}

                                {/* 2️⃣ Reactions UI */}
                                {msg.reactions?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {Object.entries(
                                      msg.reactions.reduce((acc, r) => {
                                        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                        return acc;
                                      }, {}),
                                    ).map(([emoji, count]) => (
                                      <span
                                        key={emoji}
                                        className="text-[10px] bg-black/20 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/5"
                                      >
                                        {emoji}{" "}
                                        <span className="opacity-50">
                                          {count}
                                        </span>
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-1.5 gap-4">
                                  {msg.isPinned && (
                                    <Pin
                                      size={10}
                                      className="text-yellow-500"
                                    />
                                  )}
                                  <span
                                    className={`text-[9px] block opacity-30 font-bold flex-1 ${isMe ? "text-right" : "text-left"}`}
                                  >
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" },
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={bottomRef} className="h-4" />
                </div>

                <AnimatePresence>
                  {(newMsgIndicator || typingUser) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                    >
                      {/* 3️⃣ Typing UI */}
                      {typingUser && (
                        <div className="bg-indigo-600/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 border border-white/10">
                          {typingUser} is transmitting...
                        </div>
                      )}
                      {newMsgIndicator && (
                        <button
                          onClick={() => scrollToBottom("smooth")}
                          className="flex items-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
                        >
                          New Packets <ChevronDown size={14} />
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <footer className="p-6 bg-[#030014]/80 backdrop-blur-2xl border-t border-white/5">
                  <div className="max-w-4xl mx-auto flex flex-col gap-3">
                    <AnimatePresence>
                      {replyingTo && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                            <div>
                              <p className="text-[10px] font-black text-indigo-400 uppercase">
                                Replying to {replyingTo.username}
                              </p>
                              <p className="text-xs text-gray-400 truncate italic">
                                {replyingTo.message}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="text-gray-500"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      )}
                      {/* 1️⃣ Image Preview */}
                      {image && (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-pink-500"
                        >
                          <img
                            src={imagePreview}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setImage(null)}
                            className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-4">
                      {/* 1️⃣ File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        id="imageUpload"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setImage(file);
                          setImagePreview(URL.createObjectURL(file));
                        }}
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowEmoji(!showEmoji)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${showEmoji ? "bg-pink-500" : "bg-white/5"}`}
                        >
                          <Smile size={20} />
                        </button>
                        <label
                          htmlFor="imageUpload"
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <ImageIcon size={20} className="text-gray-400" />
                        </label>
                      </div>

                      <div className="flex-1 relative">
                        <input
                          value={input}
                          onChange={handleInputChange}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          placeholder={
                            replyingTo
                              ? `Replying...`
                              : "Broadcast to network..."
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={isUploading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center"
                        >
                          {isUploading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    {showEmoji && (
                      <div className="absolute bottom-28 left-6 z-50 shadow-2xl">
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
                </footer>
              </>
            )}
          </div>

          <aside className="hidden lg:flex w-72 border-l border-white/5 bg-[#030014]/30 flex-col p-8">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">
              Security Protocol
            </h3>
            <ul className="space-y-4 flex-1">
              <ProtocolItem
                icon={<ShieldCheck size={14} />}
                text="End-to-End Encrypted"
              />
              <ProtocolItem icon={<Zap size={14} />} text="Zero Spam Latency" />
              <ProtocolItem
                icon={<Users size={14} />}
                text="Elite Node Access"
              />
            </ul>
            <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-pink-600/10 border border-white/5 rounded-3xl backdrop-blur-md">
              <p className="text-xs font-bold text-white mb-2 tracking-tight">
                Active Sync
              </p>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Network status is optimal. All packets are authorized.
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
    <span className="text-pink-500">{icon}</span> {text}
  </li>
);

export default Community;
