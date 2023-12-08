import React, { useState } from "react";

const ToggleSwitch = ({ onToggle, initialState }) => {
  const [isActive, setIsActive] = useState(initialState);

  const handleToggle = () => {
    setIsActive(!isActive);
    onToggle(!isActive);
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" onChange={handleToggle} />
        <div
          className={`block ${
            !isActive ? "bg-primary_gray_2" : "bg-green-600"
          } w-12 h-6 rounded-full`}
        ></div>
        <div
          className={`dot absolute left-2 top-1 bg-white w-4 h-4 rounded-full transition  ${
            isActive ? "transform translate-x-full bg-white" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
