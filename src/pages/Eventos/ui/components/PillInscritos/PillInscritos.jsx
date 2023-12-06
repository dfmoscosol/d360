import React from "react";

import { MdCheckCircle } from "react-icons/md";

const PillInscritos = ({ index, title, subTitle, children }) => {
  return (
    <div
      className="flex w-full p-4 rounded-lg border border-primary_gray_5 hover:shadow-xl transition-all duration-200 justify-between items-center"
      key={index}
    >
      <div className="flex gap-2 items-center">
        <div className="text-green-700">
          <MdCheckCircle size={15} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary_gray_4">
            {title}
          </span>
          <span className="text-xs text-primary_gray_2">{subTitle}</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PillInscritos;
