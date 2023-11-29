import React from "react";

import { useSelector } from "react-redux";
import { Navbar } from "@components";

const PageWrapper = (props) => {
  const { extra, children, ...rest } = props;
  const isOpen = useSelector((state) => state.sidebarState.isOpen);

  return (
    <div
      className={`duration-500 bg-white ${
        isOpen ? "md:ml-72" : "md:ml-20"
      } h-screen`}
      {...rest}
    >
      <div className={`h-full overflow-auto flex flex-col`}>
        <Navbar />
        <div className={`h-full px-12 ${extra} `}>{children}</div>
      </div>
    </div>
  );
};

export default PageWrapper;
