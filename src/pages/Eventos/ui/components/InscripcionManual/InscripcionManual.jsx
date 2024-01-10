import React from "react";

import { MdOutlinePersonAdd } from "react-icons/md";

const InscripcionManual = ({ index, title, subTitle, children }) => {
  return (
    <div
      className="flex w-full border-l-4 border-primary_gray_5 px-4 py-2  hover:shadow-xl transition-all duration-200 justify-between items-center"
      key={index}
    >
      <div className="flex gap-3 items-center">
        <div className="flex items-center p-2 bg-primary_gray_1 rounded-lg text-primary_gray_4 relative">
          <MdOutlinePersonAdd size={25} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary_color_1">
            {title}
          </span>
          <span className="text-xs text-primary_gray_2">{subTitle}</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InscripcionManual;
