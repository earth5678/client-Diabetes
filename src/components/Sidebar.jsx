import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './Sidebar.css';
import { UilEstate, UilClipboardAlt, UilUsersAlt, UilSignOutAlt } from "@iconscout/react-unicons";

const Sidebar = () => {

  const { pathname } = useLocation();

    const navigate = useNavigate();
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      navigate("/login");
      return null;
    }
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login"); // Navigate to the login page
    };
  
  return (
    <div className="container1">
      <nav className="sidebar">
        <div className='logo1' onClick={() => navigate("/")}>
          <img src='/assets/logo3.png' alt='Logo' />
        </div>
        
        <div className="menu">
          <div className={pathname === "/" ? "menuItem active" : "menuItem"}>
            <UilEstate />
            <Link to="/">Dashboard</Link>
          </div>

          <div className={pathname === "/user" ? "menuItem active" : "menuItem"}>
          <UilUsersAlt />
            <Link to="/user">ข้อมูลผู้ใช้</Link>
          </div>

          <div className={pathname === "/tracking" ? "menuItem active" : "menuItem"}>
          <UilUsersAlt />
            <Link to="/tracking">ติดตามผู้ป่วย</Link>
          </div>
          
          <div className={pathname === "/food" ? "menuItem active" : "menuItem"}>
          <UilClipboardAlt />
            <Link to="/food">อาหารที่แนะนำ</Link>
          </div>

          <div className={pathname === "/forbidden" ? "menuItem active" : "menuItem"}>
          <UilClipboardAlt />
            <Link to="/forbidden">อาหารที่ควรงด</Link>
          </div>

          <div className={pathname === "/chat" ? "menuItem active" : "menuItem"}>
          <UilUsersAlt />
            <a href="http://localhost:5350/">แชท</a>
          </div>

          <div className="menuItem" onClick={handleLogout}>
            <UilSignOutAlt />
            <span>Logout</span>
          </div>

        </div>
      </nav>


    </div>
  );
};

export default Sidebar;
