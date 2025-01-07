
import ChatArea from "../components/ChatArea/ChatArea";
import "./Chat.css";
import Navbar from "../components/Navbar/Navbar";
const Chat = () => {
  return (
    <div>
        <Navbar content = {"View Analytics → "} href = {"/analytics"} bool = {false} />

       <div className="chat">
      <ChatArea />
    </div>
    </div>
   
  );
};

export default Chat;
