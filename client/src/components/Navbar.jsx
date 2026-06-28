import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

      return (
        <div className="navbar">
      
      <h1>Notes Sharing Platform</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          marginTop: "15px",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/profile">Profile</Link>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
