import React, { useState, useEffect } from "react";

import { MdCheckCircle, MdClose, MdError } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "@redux/features/notification/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { isVisible, message, isError } = useSelector(
    (state) => state.notificationState
  );

  // Función para cerrar la notificación manualmente
  const handleClose = () => {
    dispatch(hideNotification());
  };

  // Renderizar condicionalmente en base a `visible`
  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-24 right-5 bg-white rounded-lg shadow-lg border border-primary_gray_1 ${
        isError ? "border-r border-red-500" : ""
      }  rounded flex items-center justify-start`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex relative gap-4 py-6 pl-4 pr-12 items-center">
        <div>
          {isError ? (
            <MdError size={25} className="text-red-700" />
          ) : (
            <MdCheckCircle size={25} className="text-green-700" />
          )}
        </div>

        <div className="flex flex-col text-primary_color_1">
          {isError ? (
            <span className="font-semibold">Error!</span>
          ) : (
            <span className="font-semibold">Éxito!</span>
          )}
          <span className=" font-medium text-sm">{message}</span>
        </div>

        <button
          className="ml-4 absolute top-2 right-2 text-primary_color_1"
          onClick={handleClose}
        >
          <MdClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
