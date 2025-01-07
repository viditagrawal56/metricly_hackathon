import ChatArea from "../components/ChatArea/ChatArea";
import Navbar from "../components/Navbar/Navbar";
import "./Chat.css";
const Chat = () => {
  return (
    <div className="chat">
      <Navbar />
      <ChatArea />
    </div>
  );
};

export default Chat;
