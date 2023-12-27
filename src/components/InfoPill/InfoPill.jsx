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
  MdOutlinePersonOutline,
  MdOutlineVerified,
  MdInfo,
} from "react-icons/md";

import { GiTeamIdea } from "react-icons/gi";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { GrWorkshop } from "react-icons/gr";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";

const InfoPill = ({ type, value, size, icon, isRadial, isSquare }) => {
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
  } else if (type === "info") {
    colors = "bg-cyan-100 text-cyan-600";
  }

  if (size === "small") {
    sizeIcon = 18;
    sizeText = "text-xs";
  } else if (size === "medium") {
    sizeIcon = 23;
    sizeText = "text-sm";
  } else if (size === "large") {
    sizeIcon = 30;
    sizeText = "text-md";
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
  } else if (icon === "like") {
    iconPill = <AiFillLike size={sizeIcon} />;
  } else if (icon === "dislike") {
    iconPill = <AiFillDislike size={sizeIcon} />;
  } else if (icon === "person") {
    iconPill = <MdOutlinePersonOutline size={sizeIcon} />;
  } else if (icon === "verified") {
    iconPill = <MdOutlineVerified size={sizeIcon} />;
  } else if (icon === "info") {
    iconPill = <MdInfo size={sizeIcon} />;
  } else if (icon === "charla") {
    iconPill = <GrWorkshop size={sizeIcon} />;
  } else if (icon === "jornada") {
    iconPill = <GiTeamIdea size={sizeIcon} />;
  } else if (icon === "taller") {
    iconPill = <FaChalkboardTeacher size={sizeIcon} />;
  } else if (icon === "observacion") {
    iconPill = <SiGoogleclassroom size={sizeIcon} />;
  }

  return (
    <div
      className={`flex items-center gap-2 ${colors} ${sizeText} font-medium py-2 px-3 ${
        isRadial ? "rounded-full" : isSquare ? "rounded-lg" : "rounded-xl"
      }`}
    >
      {iconPill}
      {!(isRadial || isSquare) && <span>{value}</span>}
    </div>
  );
};

export default InfoPill;
