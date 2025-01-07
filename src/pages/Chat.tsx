import ChatArea from "../components/ChatArea/ChatArea";
import GridLightBackground from "../components/GridLightBackground/GridLightBackground";
import Navbar from "../components/Navbar/Navbar";
import "./Chat.css";
const Chat = () => {
  return (
    <div>
      <GridLightBackground />
      <div className="chat page-background">
        <Navbar
          content={"View Analytics → "}
          href={"/analytics"}
          bool={false}
        />
        <ChatArea />
      </div>
    </div>
  );
};

export default Chat;
