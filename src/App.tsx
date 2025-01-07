import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Chart from "./pages/Chart";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/graph" element={<Chart />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
