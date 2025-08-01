import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const chatContainerRef = useRef(null);

  // Load initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading messages:", err.message);
      }
    };
    fetchMessages();
  }, []);

  // Real-time updates
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleUsernameSubmit = () => {
    if (sender.trim()) {
      setShowUsernameModal(false);
    }
  };

  const leaveChat = () => {
    setSender("");
    setShowUsernameModal(true);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMsg = { sender, content: message };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, newMsg);
      setMessages((prev) => [...prev, newMsg]);
      socket.emit("sendMessage", newMsg);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };

  return (
    <div style={{width:'1200px', height:'400px', fontFamily: "Segoe UI, sans-serif", minHeight: "100vh", background: "#f0f2f5", padding: "2rem" }}>
      <div style={{
        maxWidth: "100%",
        margin: "auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "1.5rem",
        display: showUsernameModal ? "none" : "block",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#333" }}> Real-time Chat</h2>
          <button onClick={leaveChat} style={{
            background: "#ff4d4f",
            border: "none",
            color: "white",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}>
            Leave
          </button>
        </div>

        <div
          ref={chatContainerRef}
          style={{
            height: "350px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginTop: "1rem",
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, index) => {
            const isMine = msg.sender === sender;
            return (
              <div
                key={index}
                style={{
                  alignSelf: isMine ? "flex-end" : "flex-start",
                  backgroundColor: isMine ? "#007bff" : "#e4e6eb",
                  color: isMine ? "white" : "black",
                  padding: "0.7rem 1rem",
                  borderRadius: "16px",
                  maxWidth: "70%",
                  marginBottom: "0.8rem",
                  fontSize: "1rem",
                }}
              >
                <strong>{msg.sender}:</strong> <br />{msg.content}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", marginTop: "1rem" }}>
          <input
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "1rem",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "0.5rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Username Prompt Modal */}
      {showUsernameModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            textAlign: "center",
            width: "300px"
          }}>
            <h3>Enter Your Name</h3>
            <input
              type="text"
              placeholder="e.g. Mallikarjun"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                marginTop: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
            />
            <button
              onClick={handleUsernameSubmit}
              style={{
                marginTop: "1rem",
                width: "100%",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                padding: "0.6rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Join Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
