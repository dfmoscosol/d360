import React from "react";

const PillPorInscribir = ({ index, title, subTitle, children }) => {
  return (
    <div
      className="flex flex-col w-full p-4 rounded-lg border border-primary_gray_5 hover:shadow-xl transition-all duration-200"
      key={index}
    >
      <span className="text-sm font-medium text-primary_color_1">{title}</span>
      <span className="text-xs text-primary_gray_3">{subTitle}</span>
      <div className="flex gap-2 mt-3">{children}</div>
    </div>
  );
};

export default PillPorInscribir;
