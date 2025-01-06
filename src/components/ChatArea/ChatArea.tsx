import React, { useState, useEffect, useRef } from "react";
import { BiSend } from "react-icons/bi";

import "./ChatArea.css";

interface Message {
  type: "user" | "response" | "error";
  text: string;
}

const LoadingIndicator = () => (
  <div className="message loading-message">
    <div className="loading-dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>
);

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(ws);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          { type: "response", text: data.message },
        ]);
      } else if (data.type === "error") {
        setIsLoading(false);
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

  useEffect(() => {
    const handleResize = () => {
      scrollToBottom();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "" || !requestId) return;
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    try {
      const response = await fetch(
        "https://metricly-hackathon.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_value: input,
            requestId: requestId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-container">
        <div
          className="messages"
          style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.type === "user" ? "user-message" : "response-message"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-button" onClick={sendMessage}>
            Send <BiSend className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
