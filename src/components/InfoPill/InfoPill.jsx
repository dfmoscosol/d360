import React from "react";

import {
  MdCheckCircle,
  MdClose,
  MdEditNote,
  MdDoDisturbOn,
  MdBackHand,
  MdEmojiPeople,
  MdDateRange,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";

const InfoPill = ({ type, value, size, icon }) => {
  let colors = "";
  let sizeIcon = "";
  let sizeText = "";
  let iconPill = "";

  if (type === "success") {
    colors = "bg-green-200 text-green-700";
  } else if (type === "warning") {
    colors = "bg-yellow-200 text-yellow-700";
  } else if (type === "error") {
    colors = "bg-red-200 text-red-700";
  } else if (type === "date") {
    colors = "bg-primary_gray_1 text-primary_gray_4";
  }

  if (size === "small") {
    sizeIcon = 18;
    sizeText = "text-xs";
  } else if (size === "medium") {
    sizeIcon = 23;
    sizeText = "text-sm";
  }

  if (icon === "check") {
    iconPill = <MdCheckCircle size={sizeIcon} />;
  } else if (icon === "inscripciones") {
    iconPill = <MdEditNote size={sizeIcon} />;
  } else if (icon === "close") {
    iconPill = <MdDoDisturbOn size={sizeIcon} />;
  } else if (icon === "asistencia") {
    iconPill = <MdEmojiPeople size={sizeIcon} />;
  } else if (icon === "date") {
    iconPill = <MdDateRange size={sizeIcon} />;
  } else if (icon === "entrada") {
    iconPill = <MdKeyboardArrowUp size={sizeIcon} />;
  } else if (icon === "salida") {
    iconPill = <MdKeyboardArrowDown size={sizeIcon} />;
  }

  return (
    <div
      className={`flex items-center gap-1 py-1 px-2 rounded-xl ${colors} ${sizeText} font-medium`}
    >
      {iconPill}
      <span>{value}</span>
    </div>
  );
};

export default InfoPill;
