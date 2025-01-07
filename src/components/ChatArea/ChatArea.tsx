import React, { useState, useEffect, useRef } from "react";
import { BiSend } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showInitialContent, setShowInitialContent] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "Curious about your social impact? Ask away!",
    "Type here to unlock insights about your audience!",
    "Need help with engagement stats? Start typing!",
  ];

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

  // Handle placeholder animation
  useEffect(() => {
    if (input.trim() !== "") return; // Stop cycling when user starts typing

    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 1500); // Change placeholder every 1.5 seconds

    return () => clearInterval(interval);
  }, [input, placeholders.length]);

  const sendMessage = async () => {
    if (input.trim() === "" || !requestId) return;
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setShowInitialContent(false);
    setResponseLoading(true);
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

      if (response.ok) {
        setResponseLoading(false);
      }

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      setResponseLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim() !== "") {
      setShowInitialContent(false);
    } else if (messages.length !== 0) {
      setShowInitialContent(false);
    } else {
      setShowInitialContent(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <div className="chat-area">
        <div className="chat-container">
          <div
            className="messages"
            style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
          >
            <AnimatePresence>
              {showInitialContent && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="initial-content"
                >
                  <h2>AI Knows Your Social Secrets—Let’s Talk!</h2>
                  <div className="social-words">
                    <span>Analytics</span>
                    <span>Engagement</span>
                    <span>Insights</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`message ${
                    msg.type === "user" ? "user-message" : "response-message"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <div className="placeholder-wrapper">
              {/* Placeholder Animation */}
              <AnimatePresence mode="wait">
                {input.trim() === "" && (
                  <motion.div
                    key={placeholderIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="placeholder-text"
                  >
                    {placeholders[placeholderIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <input
              type="text"
              className="input-field"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setInput("")} // Optionally clear placeholder on focus
              placeholder="" // Leave native placeholder empty to use custom one
            />
            <button
              className="send-button"
              onClick={sendMessage}
              disabled={responseLoading}
            >
              Send <BiSend className="send-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
