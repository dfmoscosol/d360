import React from "react";

const HorizontalPill = ({ title, subTitle }) => {
  return (
    <div className="flex flex-col border-l-4 pl-2 border-primary_color_1">
      <span className="text-primary_gray_2 font-normal text-xs">{title}</span>
      <span className="text-sm text-primary_gray_4 font-medium">
        {subTitle}
      </span>
    </div>
  );
};

export default HorizontalPill;
