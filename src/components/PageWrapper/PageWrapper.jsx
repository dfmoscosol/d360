import React from "react";

import { useSelector } from "react-redux";
import { Navbar, Notification } from "@components";

const PageWrapper = (props) => {
  const { extra, children, ...rest } = props;
  const isOpen = useSelector((state) => state.sidebarState.isOpen);

  return (
    <div
      className={`duration-500 bg-primary_gray_1 ${
        isOpen ? "md:ml-72" : "md:ml-20"
      } h-screen`}
      {...rest}
    >
      <div
        className={`h-full overflow-auto flex flex-col px-4 sm:px-8 lg:px-10 transition-all duration-200 pb-12`}
      >
        <Navbar />
        {/** 
        <Notification />*/}
        <div className={`h-full ${extra} `}>{children}</div>
      </div>
    </div>
  );
};

export default PageWrapper;
