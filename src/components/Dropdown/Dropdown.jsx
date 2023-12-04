import React, { useState } from "react";
import { Link } from "react-router-dom";

const Dropdown = ({ trigger, dropdownItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div onClick={toggleDropdown}>{trigger}</div>
      {isOpen && (
        <div className="flex flex-col origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-xl p-2 bg-white  focus:outline-none z-10">
          {dropdownItems.map((item, index) => (
            <Link
              to={item.to}
              key={index}
              className=" text-primary_gray_2 hover:bg-primary_gray_1 hover:text-black p-2 rounded-lg flex gap-2 items-center"
            >
              <div className={`${item.colors} p-2 rounded-lg`}>{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
