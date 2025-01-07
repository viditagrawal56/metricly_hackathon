import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaArrowRight, FaStop } from "react-icons/fa";
import "./ChatArea.css";

interface Message {
  type: "user" | "response" | "error";
  text: string;
}

const LoadingDots: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
    });
  }, [controls]);

  return (
    <motion.div className="loading-dots" animate={controls}>
      <motion.span>.</motion.span>
      <motion.span>.</motion.span>
      <motion.span>.</motion.span>
    </motion.div>
  );
};

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket("wss://metricly-hackathon.onrender.com");
    setWs(socket);

    socket.onopen = () => console.log("WebSocket connection established");

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "requestId") {
        setRequestId(data.requestId);
      } else if (data.type === "response") {
        setMessages((prev) => [
          ...prev,
          { type: "response", text: data.message },
        ]);
        setIsLoading(false);
      } else if (data.type === "error") {
        setMessages((prev) => [...prev, { type: "error", text: data.message }]);
        setIsLoading(false);
      }
    };

    socket.onclose = () => console.log("WebSocket connection closed");

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "" || !requestId) return;

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setIsLoading(true);

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

      if (!response.ok) throw new Error("Failed to send message");
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
    ws?.close();
  };

  return (
    <div className="chat-area">
      <div className="chat-container">
        <motion.div
          className="messages"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`message ${
                  msg.type === "user" ? "user-message" : "response-message"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-content">{msg.text}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              className="loading-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-content">
                {"Metricly is thinking".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      repeat: Infinity,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                <LoadingDots />
              </div>
            </motion.div>
          )}
        </motion.div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <motion.button
            className="send-button"
            onClick={isLoading ? stopLoading : sendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <FaStop /> : <FaArrowRight />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
