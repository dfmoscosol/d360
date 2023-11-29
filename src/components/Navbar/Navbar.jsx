import React from "react";

import Breadcrumbs from "./components/Breadcrumbs";

const Navbar = () => {
  return (
    <div className="flex w-full items-center px-12 pb-8 pt-12">
      <Breadcrumbs />
    </div>
  );
};

export default Navbar;
