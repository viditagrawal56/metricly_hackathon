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
          isNumberedList ? 
            <ol key={`list-${index}`}>{currentList}</ol> : 
            <ul key={`list-${index}`}>{currentList}</ul>
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
        <li key={`list-item-${index}`}>
          {parseBoldText(line.slice(2))}
        </li>
      );
      return;
    }

    // Check for statistics with parentheses
    const statsMatch = line.match(/(.*)\(([\d,]+)\)/);
    if (statsMatch) {
      if (currentList) {
        elements.push(
          isNumberedList ? 
            <ol key={`list-${index}`}>{currentList}</ol> : 
            <ul key={`list-${index}`}>{currentList}</ul>
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
        isNumberedList ? 
          <ol key={`list-${index}`}>{currentList}</ol> : 
          <ul key={`list-${index}`}>{currentList}</ul>
      );
      currentList = null;
    }
    elements.push(
      <p key={`text-${index}`}>{parseBoldText(line)}</p>
    );
  });

  // Handle any remaining list
  if (currentList) {
    elements.push(
      isNumberedList ? 
        <ol key="list-final">{currentList}</ol> : 
        <ul key="list-final">{currentList}</ul>
    );
  }

  return <div className="parsed-response">{elements}</div>;
};


const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = new WebSocket("wss://metricly-hackathon.onrender.com");
    setWs(socket);
    console.log(ws);
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
              {msg.type === "response" ? parseResponseText(msg.text) : msg.text}
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