import React, { useState, useEffect, useRef } from "react";
import { BiSend } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import "./ChatArea.css";
import { HiOutlinePencilAlt } from "react-icons/hi";

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
const parseResponseText = (text: string) => {
  const elements: React.ReactNode[] = [];
  const lines = text.split("\n");

  let currentList: React.ReactNode[] | null = null;
  let isNumberedList = false;

  // Helper function to parse bold text within any line
  const parseBoldText = (line: string): React.ReactNode[] => {
    const boldRegex = /\*\*(.+?)\*\*/g;
    const parts = line.split(boldRegex);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={`bold-${i}`}>{part}</strong> : part
    );
  };

  lines.forEach((line, index) => {
    // Check for empty lines
    if (line.trim() === "") {
      if (currentList) {
        elements.push(
          isNumberedList ? (
            <ol key={`list-${index}`}>{currentList}</ol>
          ) : (
            <ul key={`list-${index}`}>{currentList}</ul>
          )
        );
        currentList = null;
      }
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Check for numbered lists (e.g., "1.", "2.")
    const numberedListMatch = line.match(/^\d+\.\s(.*)/);
    if (numberedListMatch) {
      if (!currentList || !isNumberedList) {
        if (currentList) {
          elements.push(<ul key={`list-${index}`}>{currentList}</ul>);
        }
        currentList = [];
        isNumberedList = true;
      }
      currentList.push(
        <li key={`list-item-${index}`}>
          {parseBoldText(numberedListMatch[1])}
        </li>
      );
      return;
    }

    // Check for bullet points
    if (line.startsWith("- ")) {
      if (!currentList || isNumberedList) {
        if (currentList) {
          elements.push(<ol key={`list-${index}`}>{currentList}</ol>);
        }
        currentList = [];
        isNumberedList = false;
      }
      currentList.push(
        <li key={`list-item-${index}`}>{parseBoldText(line.slice(2))}</li>
      );
      return;
    }

    // Check for statistics with parentheses
    const statsMatch = line.match(/(.*)\(([\d,]+)\)/);
    if (statsMatch) {
      if (currentList) {
        elements.push(
          isNumberedList ? (
            <ol key={`list-${index}`}>{currentList}</ol>
          ) : (
            <ul key={`list-${index}`}>{currentList}</ul>
          )
        );
        currentList = null;
      }
      elements.push(
        <p key={`stats-${index}`} className="stats-line">
          <span className="stats-label">
            {parseBoldText(statsMatch[1].trim())}
          </span>
          <span className="stats-value">({statsMatch[2]})</span>
        </p>
      );
      return;
    }

    // Default text handling (including bold parsing)
    if (currentList) {
      elements.push(
        isNumberedList ? (
          <ol key={`list-${index}`}>{currentList}</ol>
        ) : (
          <ul key={`list-${index}`}>{currentList}</ul>
        )
      );
      currentList = null;
    }
    elements.push(<p key={`text-${index}`}>{parseBoldText(line)}</p>);
  });

  // Handle any remaining list
  if (currentList) {
    elements.push(
      isNumberedList ? (
        <ol key="list-final">{currentList}</ol>
      ) : (
        <ul key="list-final">{currentList}</ul>
      )
    );
  }

  return <div className="parsed-response">{elements}</div>;
};

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const [showInitialContent, setShowInitialContent] = useState<boolean>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved).length === 0 : true;
  });

  const [input, setInput] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [responseLoading] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "Curious about your social impact? Ask away!",
    "Type here to unlock insights about your audience!",
    "Need help with engagement stats? Start typing!",
  ];

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    setShowInitialContent(true);
    setInput("");
    setRequestId("");

    if (ws) {
      ws.close();
    }
    const newSocket = initializeWebSocket();
    setWs(newSocket);
  };

  // WebSocket initialization function
  const initializeWebSocket = () => {
    const socket = new WebSocket("wss://metricly-hackathon.onrender.com");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.type === "requestId") {
          setRequestId(data.requestId);
        } else if (data.type === "response") {
          setIsLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "response" as const,
              text: data.message,
            },
          ]);
        } else if (data.type === "error") {
          setIsLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "error" as const,
              text: data.message || "An error occurred",
            },
          ]);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    return socket;
  };

  useEffect(() => {
    const socket = initializeWebSocket();
    return () => socket.close();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      scrollToBottom();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (input.trim() !== "") return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000); // Change placeholder every 2.5 seconds

    return () => clearInterval(interval);
  }, [input, placeholders.length]);

  const sendMessage = async () => {
    if (input.trim() === "" || !requestId) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "user" as const,
        text: input.trim(),
      },
    ]);

    setInput("");
    setIsLoading(true);
    setShowInitialContent(false);

    try {
      const response = await fetch(
        "https://metricly-hackathon.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input_value: input.trim(),
            requestId: requestId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "error" as const,
          text: "Failed to send message",
        },
      ]);
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
          <div className="chat-header">
            <button onClick={startNewChat} className="new-chat-button">
              <HiOutlinePencilAlt />
            </button>
          </div>
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
                  <h2>Your Social Metrics, Simplified - Let's Chat!</h2>
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
                  {msg.type === "response"
                    ? parseResponseText(msg.text)
                    : msg.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <div className="placeholder-input">
              <div className="placeholder-wrapper">
                {/* Placeholder Animation */}
                <AnimatePresence mode="wait">
                  {input.trim() === "" && (
                    <motion.div
                      key={placeholderIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.7 }}
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
                onFocus={() => setInput("")}
                placeholder=""
              />
            </div>

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
