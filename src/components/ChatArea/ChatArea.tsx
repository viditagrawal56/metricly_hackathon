import "./ChatArea.css";

const ChatArea = () => {
  return (
    <div className="chat-area">
      <div className="chat-container">
        <div className="messages">Test Message</div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            className="input-field"
          />
          <button className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
