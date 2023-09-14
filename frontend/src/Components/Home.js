import "../css/Home.css";
import Navbar from "./Navbar";
import Incoming from "./Incoming";
import Accounts from "./Accounts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <Router>
      <div className="home">
        <Navbar />
        <Routes>
          <Route path="/incoming" element={<Incoming />} />
          <Route path="/accounts" element={<Accounts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Home;
