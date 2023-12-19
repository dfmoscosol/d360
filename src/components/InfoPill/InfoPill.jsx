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
  MdDelete,
} from "react-icons/md";

import { AiFillLike, AiFillDislike } from "react-icons/ai";

import { GrWorkshop } from "react-icons/gr";

const InfoPill = ({ type, value, size, icon, isRadial }) => {
  let colors = "";
  let sizeIcon = "";
  let sizeText = "";
  let iconPill = "";

  if (type === "success") {
    colors = "bg-green-100 text-green-600";
  } else if (type === "warning") {
    colors = "bg-yellow-100 text-yellow-600";
  } else if (type === "error") {
    colors = "bg-red-100 text-red-600";
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
    iconPill = <MdClose size={sizeIcon} />;
  } else if (icon === "asistencia") {
    iconPill = <MdEmojiPeople size={sizeIcon} />;
  } else if (icon === "date") {
    iconPill = <MdDateRange size={sizeIcon} />;
  } else if (icon === "entrada") {
    iconPill = <MdKeyboardArrowUp size={sizeIcon} />;
  } else if (icon === "salida") {
    iconPill = <MdKeyboardArrowDown size={sizeIcon} />;
  } else if (icon === "delete") {
    iconPill = <MdDelete size={sizeIcon} />;
  } else if (icon === "charla") {
    iconPill = <GrWorkshop size={sizeIcon} />;
  } else if (icon === "like") {
    iconPill = <AiFillLike size={sizeIcon} />;
  } else if (icon === "dislike") {
    iconPill = <AiFillDislike size={sizeIcon} />;
  }

  return (
    <div
      className={`flex items-center gap-1 ${colors} ${sizeText} font-medium p-2 ${
        isRadial ? " rounded-full" : "rounded-xl"
      } `}
    >
      {iconPill}
      {!isRadial && <span>{value}</span>}
    </div>
  );
};

export default InfoPill;
