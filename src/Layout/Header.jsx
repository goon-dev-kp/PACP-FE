import logo from "../assets/logo.png";
import {
  FaSearch,
  FaBell,
  FaChevronDown,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";
import "../Style/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.Role || decoded.role || "");
      } catch (error) {
        console.error("Token invalid:", error);
      }
    }

    const handleStorage = () => {
      const newToken = localStorage.getItem("token");
      setIsLoggedIn(!!newToken);
      if (newToken) {
        try {
          const decoded = jwtDecode(newToken);
          setRole(decoded.Role || decoded.role || "");
        } catch (error) {
          console.log(error)
          setRole("");
        }
      } else {
        setRole("");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleProfileBtnClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole("");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" className="nav-link">
            <img src={logo} alt="This is logo" />
          </Link>
        </div>
        <nav className="navbar">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/list-pet" className="nav-link">Pet</Link>
            </li>
            <li className="nav-item">
              <Link to="/map" className="nav-link">Map</Link>
            </li>
            <li className="nav-item">
              <Link to="/rescue" className="nav-link">Cứu Hộ</Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">Diễn Đàn</a>
            </li>
            <li className="nav-item">
              <Link to={"/about-us"} className="nav-link">Về Chúng Tôi</Link>
            </li>
            {isLoggedIn && role === "VENDOR" && (
              <li className="nav-item">
                <Link to="/manage-pet" className="nav-link">Quản Lý</Link>
              </li>
            )}
          </ul>
          <div className="header-right">
            <button className="search-btn">
              <FaSearch className="icon" />
            </button>
            <div className="notification">
              <FaBell className="icon" />
              <span className="badge">6</span>
            </div>
            {!isLoggedIn ? (
              <Link to={"/login"}>
                <button className="login-btn">Login</button>
              </Link>
            ) : (
              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="profile-btn"
                  onClick={handleProfileBtnClick}
                  style={{ background: "none", border: "none" }}
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                  <FaUserCircle size={32} color="#333" />
                  <FaChevronDown style={{ marginLeft: 4 }} />
                </button>
                {showDropdown && (
                  <div className="profile-dropdown">
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      <FaUserCircle style={{ marginRight: 8 }} /> Trang cá nhân
                    </button>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="hamburger">
              <FaBars />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
