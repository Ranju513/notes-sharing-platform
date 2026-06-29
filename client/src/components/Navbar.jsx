import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
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
        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/upload">Upload</Link>

            <div className="menu" ref={menuRef}>
              <button
                className="avatar-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {firstLetter}
              </button>

              {menuOpen && (
                <div className="dropdown">
                  <button onClick={() => navigate("/profile")}>
                    <FaUser /> Profile
                  </button>

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
