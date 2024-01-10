import React from "react";

import { Outlet } from "react-router-dom";
import { Notification } from "@components";

const LoginLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Notification />
      <Outlet />
    </div>
  );
};

export default LoginLayout;
