import React from "react";

import Breadcrumbs from "./components/Breadcrumbs";
import { MdMenu, MdMenuOpen } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "@redux/features/sidebar/sidebarSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebarState.isOpen);

  return (
    <div className="flex w-full items-center pb-8 pt-12">
      <button
        className="flex items-center justify-center text-primary_color_1 mr-2 xs:flex md:hidden"
        onClick={() => {
          dispatch(setOpen(!isOpen));
        }}
      >
        {isOpen ? <MdMenuOpen size={30} /> : <MdMenu size={30} />}
      </button>

      <Breadcrumbs />
    </div>
  );
};

export default Navbar;
