import React from "react";

import {
  MdCheckCircle,
  MdClose,
  MdEditNote,
  MdDoDisturbOn,
  MdBackHand,
  MdEmojiPeople,
  MdDateRange,
  MdOutlineEdit,
  MdDelete,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdAdd,
} from "react-icons/md";

import { Oval } from "react-loader-spinner";

const Button = ({
  type,
  value,
  size,
  icon,
  onClick,
  isLoading,
  isRadial,
  isDisabled,
  extra,
}) => {
  let colors = "";
  let sizeIcon = "";
  let sizeText = "";
  let iconPill = "";
  let colorOval = "";

  if (type === "success") {
    colors =
      "bg-green-100 text-green-600 hover:bg-green-200 active:bg-green-300";
    colorOval = "#15803d";
  } else if (type === "warning") {
    colors =
      "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 active:bg-yellow-300";
    colorOval = "#a16207";
  } else if (type === "error") {
    colors = "bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300";
    colorOval = "#b91c1c";
  } else if (type === "date") {
    colors = "bg-primary_gray_1 text-primary_gray_4";
    colorOval = "#3f3f46";
  } else if (type === "info") {
    colors = "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 active:bg-cyan-300";
    colorOval = "#0e7490";
  } else if (type === "gray") {
    colors = "bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-400";
    colorOval = "#0e7490";
  }

  if (size === "small") {
    sizeIcon = 19;
    sizeText = "text-xs p-2";
  } else if (size === "medium") {
    sizeIcon = 22;
    sizeText = "text-sm p-2";
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
  } else if (icon === "edit") {
    iconPill = <MdOutlineEdit size={sizeIcon} />;
  } else if (icon === "delete") {
    iconPill = <MdDelete size={sizeIcon} />;
  } else if (icon === "entrada") {
    iconPill = <MdKeyboardArrowUp size={sizeIcon} />;
  } else if (icon === "salida") {
    iconPill = <MdKeyboardArrowDown size={sizeIcon} />;
  } else if (icon === "left") {
    iconPill = <MdOutlineKeyboardArrowLeft size={sizeIcon} />;
  } else if (icon === "right") {
    iconPill = <MdOutlineKeyboardArrowRight size={sizeIcon} />;
  } else if (icon === "add") {
    iconPill = <MdAdd size={sizeIcon} />;
  }

  return (
    <button
      disabled={isLoading || isDisabled}
      onClick={onClick}
      className={`flex gap-1 items-center justify-center hover:shadow-lg transition-all duration-300 font-medium ${
        isRadial ? "rounded-full" : "rounded-lg"
      } ${colors} ${sizeText} ${
        isLoading ? "animate-pulse cursor-not-allowed" : "animate-none"
      } ${extra} ${
        isDisabled
          ? "cursor-not-allowed bg-primary_gray_1 border-primary_gray_4 text-primary_gray_4 hover:bg-primary_gray_1 hover:border-primary_gray_4 hover:shadow-none active:bg-primary_gray_1"
          : "animate-none"
      }`}
    >
      {isLoading ? (
        <Oval
          height={24}
          width={24}
          color={colorOval}
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#94a3b8"
          strokeWidth={6}
          strokeWidthSecondary={2}
        />
      ) : (
        iconPill
      )}
      {!isRadial && <span>{value}</span>}
    </button>
  );
};

export default Button;
