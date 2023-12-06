import React from "react";

import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";

// Header subcomponent
export const Header = ({ color, title, icon, linkTo }) => (
  <div className="w-full flex items-center justify-between">
    <div className="flex gap-2 items-center">
      <div className={`${color} p-2 rounded-lg`}>{icon}</div>
      <span className="font-medium text-base text-primary_gray_2">{title}</span>
    </div>
    <Link to={linkTo}>
      <div
        className={`${color} rounded-full flex items-center p-1 hover:shadow-lg transition-all duration-200`}
      >
        <MdAdd size={25} />
      </div>
    </Link>
  </div>
);

// Title subcomponent
export const Title = ({ value }) => (
  <span className="font-medium text-3xl text-primary_color_1 py-6">
    {value}
  </span>
);

// Info subcomponent
export const Info = ({ children }) => (
  <div className="flex gap-2 flex-wrap">{children}</div>
);

// Data subcomponent
export const Data = ({ dataList }) => (
  <div className="flex flex-col mt-4">
    {dataList.map((data, index) => (
      <div className="grid grid-cols-4 w-full" key={index}>
        <span className="col-span-2 sm:col-span-1 text-base font-light text-primary_gray_2">
          {data.key}
        </span>
        <span className="col-span-2 sm:col-span-3 text-base font-medium text-primary_color_1">
          {data.value}
        </span>
      </div>
    ))}
  </div>
);

// Info subcomponent
export const Footer = ({ children }) => (
  <div className="flex flex-col gap-2 w-full justify-between flex-wrap md:flex-nowrap mt-10">
    {children}
  </div>
);

// Title Paner subcomponent
export const TitlePanel = ({ value }) => (
  <span className="text-base font-medium text-primary_color_1">{value}</span>
);

const EventoView = ({ children }) => (
  <div className="flex flex-col w-full col-span-6 bg-white p-6 rounded-lg">
    {children}
  </div>
);

export default EventoView;
