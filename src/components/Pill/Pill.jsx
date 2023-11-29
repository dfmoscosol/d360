import React from "react";

const Pill = (props) => {
  const { icon, title, description } = props;

  return (
    <div className="w-full bg-primary_gray_1 rounded-lg py-2 px-4 flex items-center justify-between">
      <div className="flex flex-col ">
        <span className="text-sm font-normal text-primary_gray_3">{title}</span>
        <span className="text-xl font-semibold text-primary_color_1">
          {description}
        </span>
      </div>
      <div className="flex items-center justify-center p-2 bg-white rounded-full text-primary_color_1">
        {icon}
      </div>
    </div>
  );
};

export default Pill;
