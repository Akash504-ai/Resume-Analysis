import { useEffect, useState } from "react";
import socket from "../../src/services/socket";

const CommunityChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {

    // connect socket
    socket.connect();

    // join community room
    socket.emit("join-community");

    // receive previous messages
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    // receive new messages
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
      socket.disconnect();
    };

  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send-message", {
      userId: user._id,
      username: user.username,
      message: input
    });

    setInput("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>

      <h2>Community Chat</h2>

      {/* Chat Messages */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  );
};

export default CommunityChat;