import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
  });
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://ai-chatbot-wde5.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Simulate bot typing delay for a better experience
      setTimeout(() => {
        setMessages([...newMessages, { role: "bot", content: data.reply }]);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setMessages([...newMessages, { role: "bot", content: "Error: Could not fetch response." }]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h1>AI Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-msg" : "bot-msg"}>
            <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>{msg.content}
          </div>
        ))}
        {loading && (
          <div className="bot-msg typing">
            <span></span> <span></span> <span></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
};

export default App;
