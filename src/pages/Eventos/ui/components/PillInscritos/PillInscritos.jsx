import React from "react";

import { MdCheckCircle } from "react-icons/md";
import { MdPerson } from "react-icons/md";

const PillInscritos = ({ index, title, subTitle, observador, children }) => {
  return (
    <div
      className="flex w-full border-l-4 border-primary_gray_5 px-4 py-2  hover:shadow-xl transition-all duration-300 justify-between items-center cursor-pointer"
      key={index}
    >
      <div className="flex gap-3 items-center">
        <div className="flex items-center p-2 bg-primary_gray_1 rounded-lg text-primary_gray_4 relative">
          <MdPerson size={25} />
          <div className="text-green-600 absolute bottom-0 -right-1">
            <MdCheckCircle size={18} />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-base font-medium text-primary_text_1 tracking-tight">
            {title}
          </span>
          <span className="text-sm text-primary_gray_3 tracking-tight">{subTitle}</span>
          {observador && <span className="text-sm text-primary_gray_3 tracking-tight">Observador: {observador}</span>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PillInscritos;
