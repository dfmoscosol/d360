import React from "react";
import { MdPerson } from "react-icons/md";

const PillPorInscribir = ({ index, title, subTitle, children }) => {
  return (
    <div
      className="border-l-4 border-slate-200 px-4 py-2 flex flex-col w-full hover:shadow-xl transition-all duration-200"
      key={index}
    >
      <div className="flex gap-2 items-center">
        <div className="flex items-center p-2 bg-primary_gray_1 rounded-lg text-primary_gray_4">
          <MdPerson size={25} />
        </div>

        <div className="flex flex-col">
          <span className="text-base font-medium text-primary_color_1">
            {title}
          </span>
          <span className="text-sm font-light text-primary_gray_2">
            {subTitle}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">{children}</div>
    </div>
  );
};

export default PillPorInscribir;
