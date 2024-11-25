// Layout.js
import React from 'react';
import { Outlet } from "react-router-dom";
import Header from '../Header'; // Import the Header component

const Layout = () => {
  return (
    <div>
      <Header /> {/* Persistent header with logout button */}
      <main>
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
    </div>
  );
};

export default Layout;