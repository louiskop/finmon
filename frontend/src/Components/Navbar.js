import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <h1>Finmon</h1>
      <div>
        <NavLink to="/accounts">Accounts</NavLink>
        <NavLink to="/incoming">Incoming</NavLink>
      </div>
    </div>
  );
}

export default Navbar;
