import { Link, useNavigate } from "react-router-dom";
import { FaEllipsisV, FaMoon, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setMenuOpen(false);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  return (
    <div className="navbar">
      <h1>📚 Notes Sharing Platform</h1>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/upload">Upload</Link>
            <Link to="/profile">Profile</Link>

            <div className="menu" ref={menuRef}>
              <button
                className="menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FaEllipsisV />
              </button>

              {menuOpen && (
                <div className="dropdown">
                  <button onClick={toggleDarkMode}>
                    <FaMoon /> Dark Mode
                  </button>

                  <button onClick={logout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
