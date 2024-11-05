import React from "react";

import {
  MdEditNote,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

const StatePill = ({ hasState, stateValue, icon }) => {
  let iconPill = "";
  if (icon === "inscripcion") {
    iconPill = <MdEditNote size={20} />;
  } else if (icon === "entrada") {
    iconPill = <MdKeyboardArrowUp size={20} />;
  } else if (icon === "salida") {
    iconPill = <MdKeyboardArrowDown size={20} />;
  }

  return (
    <div
      className={`p-2 rounded-lg flex items-center justify-center gap-2 border border-primary_gray_5 ${
        hasState ? "text-green-600 b-green-100" : "text-amber-600 b-amber-200"
      } `}
    >
      {/** 
      {iconPill}*/}

      <span className="relative flex h-3 w-3">
        <span
          className={` absolute inline-flex h-full w-full rounded-full ${
            hasState ? "bg-green-500 animate-ping" : "bg-amber-200"
          } opacity-75`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            hasState ? "bg-green-400" : "bg-amber-200"
          }`}
        ></span>
      </span>
      <span className="text-xs font-medium tracking-tight text-primary_gray_4">
        {stateValue}
      </span>
    </div>
  );
};

export default StatePill;
