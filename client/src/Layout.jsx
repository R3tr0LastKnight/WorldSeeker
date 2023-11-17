import React from "react";
import Header from "./Components/Header";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="py-4 px-6 flex flex-col min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
