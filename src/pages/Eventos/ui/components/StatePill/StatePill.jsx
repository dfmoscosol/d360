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
      className={` p-2 rounded-lg flex items-center gap-1 ${
        hasState ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50"
      } `}
    >
      {iconPill}
      <span className="text-xs font-medium ">{stateValue}</span>
    </div>
  );
};

export default StatePill;
