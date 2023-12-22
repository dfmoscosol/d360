import React from "react";

import { Notification } from "@components";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Notification />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LoginLayout;
