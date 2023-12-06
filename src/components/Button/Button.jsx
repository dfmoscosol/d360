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
} from "react-icons/md";

import { Oval } from "react-loader-spinner";

const Button = ({ type, value, size, icon, onClick, isLoading, isRadial }) => {
  let colors = "";
  let sizeIcon = "";
  let sizeText = "";
  let iconPill = "";
  let colorOval = "";

  if (type === "success") {
    colors =
      "border-green-700 text-green-700 hover:bg-green-200 active:bg-green-300";
    colorOval = "#15803d";
  } else if (type === "warning") {
    colors =
      "border-yellow-700 text-yellow-700 hover:bg-yellow-200 active:bg-yellow-300";
    colorOval = "#a16207";
  } else if (type === "error") {
    colors = "border-red-700 text-red-700 hover:bg-red-200 active:bg-red-300";
    colorOval = "#b91c1c";
  } else if (type === "date") {
    colors = "bg-primary_gray_1 text-primary_gray_4";
    colorOval = "#3f3f46";
  } else if (type === "info") {
    colors =
      "border-cyan-700 text-cyan-700 hover:bg-cyan-200 active:bg-cyan-300";
    colorOval = "#0e7490";
  }

  if (size === "small") {
    sizeIcon = 18;
    sizeText = "text-xs p-1";
  } else if (size === "medium") {
    sizeIcon = 23;
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
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`flex w-full gap-1 items-center justify-center   ${
        isRadial ? "rounded-full" : "rounded-lg"
      } border ${colors} ${sizeText} hover:shadow-lg transition-all duration-300 font-medium ${
        isLoading ? "animate-pulse cursor-not-allowed" : "animate-none"
      } `}
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
