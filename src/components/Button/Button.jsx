import React from "react";

import {
  MdCheckCircle,
  MdClose,
  MdEditNote,
  MdDoDisturbOn,
  MdEmojiPeople,
  MdDateRange,
  MdOutlineEdit,
  MdDelete,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdAdd,
  MdOutlineSaveAs,
  MdOutlineSave,
  MdDangerous,
  MdOutlineCheckBox,
  MdLogin,
  MdLogout,
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
  isPrimary,
  extra,
  buttonType,
}) => {
  let colors = "";
  let sizeIcon = "";
  let sizeText = "";
  let iconPill = "";
  let colorOval = "";

  if (type === "success") {
    colors = `${
      isPrimary ? "bg-green-100 border-green-200" : "bg-white border-green-600"
    } text-green-600 hover:bg-green-200 active:bg-green-300 border`;
    colorOval = "#15803d";
  } else if (type === "warning") {
    colors = `bg-yellow-100 text-yellow-600 hover:bg-yellow-200 active:bg-yellow-300`;
    colorOval = "#a16207";
  } else if (type === "error") {
    colors = `${
      isPrimary ? "bg-red-100 border-red-200" : "bg-white border-red-600"
    } text-red-600 hover:bg-red-200 active:bg-red-300 border`;
    colorOval = "#b91c1c";
  } else if (type === "date") {
    colors = `bg-primary_gray_1 text-primary_gray_4`;
    colorOval = "#3f3f46";
  } else if (type === "info") {
    colors = `${
      isPrimary ? "bg-cyan-100 border-cyan-200" : "bg-white border-cyan-600"
    } text-cyan-600 hover:bg-cyan-200 active:bg-cyan-300 border`;
    colorOval = "#0e7490";
  } else if (type === "gray") {
    colors = `${
      isPrimary ? "bg-gray-100 border-gray-200" : "bg-white border-gray-600"
    } text-gray-600 hover:bg-gray-100 active:bg-gray-300 border`;
    colorOval = "#0e7490";
  } else if (type === "ucuenca") {
    colors = `${
      isPrimary
        ? "bg-primary_color_1 border-primary_color_1 text-white"
        : "bg-white border-primary_color_1 text-primary_color_1"
    }  hover:bg-primary_color_1 hover:text-white active:bg-primary_color_1 border`;
    colorOval = "#0e7490";
  } else if (type === "ucuencaRed") {
    colors = `${
      isPrimary
        ? "bg-primary_color_2 border-primary_color_2"
        : "bg-white border-primary_color_2"
    } text-primary_color_2 hover:bg-[#fff1f0] active:bg-[#ffe0de] border`;
    colorOval = "#0e7490";
  }

  if (size === "xsmall") {
    sizeIcon = 15;
    sizeText = "text-xs p-2";
  } else if (size === "small") {
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
    iconPill = <MdClose size={sizeIcon} />;
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
  } else if (icon === "saveEdit") {
    iconPill = <MdOutlineSaveAs size={sizeIcon} />;
  } else if (icon === "save") {
    iconPill = <MdOutlineSave size={sizeIcon} />;
  } else if (icon === "danger") {
    iconPill = <MdDangerous size={sizeIcon} />;
  } else if (icon === "approve") {
    iconPill = <MdOutlineCheckBox size={sizeIcon} />;
  } else if (icon === "login") {
    iconPill = <MdLogin size={sizeIcon} />;
  } else if (icon === "logout") {
    iconPill = <MdLogout size={sizeIcon} />;
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
          ? "cursor-not-allowed bg-gray-100 hover:bg-gray-100 hover:shadow-none active:bg-white"
          : "animate-none"
      }`}
      type={buttonType}
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
          strokeWidth={8}
          strokeWidthSecondary={10}
        />
      ) : (
        iconPill
      )}
      {!isRadial && <span>{value}</span>}
    </button>
  );
};

export default Button;
