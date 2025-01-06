import React, { useState, useEffect } from "react";
import "./ChatArea.css";

interface Message {
  type: "user" | "response" | "error";
  text: string;
}

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); 
  const [input, setInput] = useState<string>("");
  const [requestId, setRequestId] = useState<string>(""); 
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://metricly-hackathon.onrender.com");
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "requestId") {

        setRequestId(data.requestId);
      } else if (data.type === "response") {

        setMessages((prev) => [...prev, { type: "response", text: data.message }]);
      } else if (data.type === "error") {

        setMessages((prev) => [...prev, { type: "error", text: data.message }]);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);
console.log(ws)
  const sendMessage = async () => {
    if (input.trim() === "" || !requestId) return;
      setInput(""); 

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    try {
      const response = await fetch("https://metricly-hackathon.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value: input,
          requestId: requestId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // setInput(""); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type === "user" ? "user-message" : "response-message"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
