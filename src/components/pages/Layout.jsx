// Layout.jsx
import React from "react";
import Sidebar from "../Sidebar";
import { Outlet } from 'react-router-dom';
import './Layout.css'

const Layout = () => (
  <main className="main-layout">
    <Sidebar />
    <div className="main-screen">
      <Outlet />
    </div>
  </main>
);

export default Layout;
