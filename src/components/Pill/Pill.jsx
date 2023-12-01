import React from "react";

const Pill = (props) => {
  const { icon, title, description, type } = props;

  let colorsBg = "";
  if (type === 1) {
    colorsBg = "bg-amber-100 text-amber-600";
  } else if (type === 2) {
    colorsBg = "bg-teal-100 text-teal-600";
  } else if (type === 3) {
    colorsBg = "bg-blue-100 text-blue-600";
  } else if (type === 4) {
    colorsBg = "bg-rose-100 text-rose-600";
  }

  return (
    <div className="w-full border  border-primary_gray_5  px-3 py-1 rounded-lg flex items-center justify-start gap-3 ">
      <div
        className={`flex items-center justify-center p-2 rounded-lg bg-primary_gray_1 text-primary_gray_4 `} // ${colorsBg}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-primary_gray_2">{title}</span>
        <span className="text-lg font-semibold text-primary_color_1">
          {description}
        </span>
      </div>
    </div>
  );
};

export default Pill;
