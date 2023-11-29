import React from "react";

import { Link, NavLink } from "react-router-dom";
import { MdMenu, MdMenuOpen } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "@redux/features/sidebar/sidebarSlice";

import LOGO from "@assets/logo.svg";

import routes from "@routes/routes";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebarState.isOpen);

  return (
    <div
      className={`${
        isOpen ? "w-72" : "md:w-20 w-0"
      } py-10 transition-all ease-in-out duration-500 min-h-screen fixed h-screen z-50 flex flex-col bg-white border-r border-primary_gray_5`}
    >
      <div className="flex flex-col h-full justify-between px-4">
        <div className="flex flex-col h-full">
          {/** App's tittle */}
          <div className={`flex items-center justify-center w-full`}>
            <div
              className={`flex justify-start items-center whitespace-nowrap h-20 ${
                isOpen ? "w-full" : "w-0"
              } transition-all ease-in-out duration-500`}
            >
              <Link to="/">
                <img
                  src={LOGO}
                  alt="Dirección de Innovación - Universidad de Cuenca"
                  className="h-20"
                />
              </Link>
            </div>
            <button
              className="flex items-center justify-center text-primary_color_1"
              onClick={() => {
                dispatch(setOpen(!isOpen));
              }}
            >
              {isOpen ? <MdMenuOpen size={30} /> : <MdMenu size={30} />}
            </button>
          </div>

          <div className="mt-12 h-full flex flex-col justify-between">
            <div className=" flex flex-col gap-2 ">
              {routes.map((route, index) => (
                <div className="relative" key={index}>
                  <NavLink to={`/${route.path}`} key={index}>
                    {({ isActive }) => (
                      <div
                        className={`flex py-2 px-4 rounded-lg items-center justify-center ${
                          isActive
                            ? "bg-primary_gray_1 "
                            : "hover:bg-primary_gray_1"
                        } `}
                      >
                        <span
                          className={`${
                            isActive ? "text-primary_color_1" : "text-primary_gray_2"
                          } `}
                        >
                          {route.icon}
                        </span>
                        <div
                          className={`overflow-hidden text-base font-normal ${
                            isOpen ? "w-full ml-2" : "w-0"
                          }  ${
                            isActive ? "text-primary_color_1 font-medium" : " text-primary_gray_2"
                          } transition-all ease-in-out duration-500`}
                        >
                          {route.name}
                        </div>
                        {isActive && (
                          <div
                            className={`absolute top-0 -right-4 h-full w-1 bg-primary_color_2 rounded-lg`}
                          ></div>
                        )}
                      </div>
                    )}
                  </NavLink>
                </div>
              ))}
            </div>
            <div>
              <div className="py-5">
                <hr />
              </div>
              <div className="bg-primary_gray_1 rounded-lg p-2">Cerrar Sesión</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
