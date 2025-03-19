/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import "./index.css";

const Header = ({ isLoggedIn, setIsLoggedIn, setUserId }) => {
  const navigate = useNavigate();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [userDetails, setUserDetails] = useState();

  const handleProfileMenu = (show) => {
    setProfileMenuVisible(show);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".profileDropdown")) {
      setProfileMenuVisible(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("studyingClass");
    localStorage.removeItem("rollnumber");
    setUserId(null);
    setIsLoggedIn(false);
    navigate('/'); 
  };

  useEffect(() => {
    if (profileMenuVisible) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [profileMenuVisible]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`/ims/userDetails?signupId=${userId}`)
      .then((res) => {
        setUserDetails(res.data);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("studyingClass", res.data.studyingclass);
      })
  }, []);


  return (
    <header className="HeaderContainer">
      <div className="HeaderTitle">School Management System</div>
      <nav className="HeaderNav">
        <ul className="NavList">
          <li className="NavItem">
            <a href="/">Home</a>
          </li>
          <li className="NavItem">
            <a href="/about">About</a>
          </li>
          <li className="NavItem">
            <a href="/contact">Contact</a>
          </li>
        </ul>
        {isLoggedIn && (
          <UserOutlined
            onMouseEnter={() => handleProfileMenu(true)}
            onClick={() => setProfileMenuVisible(!profileMenuVisible)}
            className="profileIcon"
          />
        )}
      </nav>
      {isLoggedIn && profileMenuVisible && (
        <div className="profileDropdown">
          <ul className="profileDetails">
            <li>
              <div className="userName" title="User Name">
                {userDetails.firstName || userDetails.lastName }
              </div>
            </li>
            <li>
              <div className="userLabel" title="Email">
              {userDetails.email }
              </div>
            </li>
            <li>
              <div className="userLabel" title="Mobile">
              {userDetails.mobile }
              </div>
            </li>
          </ul>
          <ul className="profileLinks">
            <li onClick={() => handleProfileMenu(false)}>
              <a className="profileLinksItem">
                <div className="label" onClick={handleLogout}>Logout</div>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
