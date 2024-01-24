import React, { useState, useEffect } from "react";

import { MdCheckCircle, MdClose, MdError } from "react-icons/md";
import { InfoPill } from "@components";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "@redux/features/notification/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";

const Notification = () => {
  const dispatch = useDispatch();
  const { isVisible, message, isError } = useSelector(
    (state) => state.notificationState
  );

  // Función para cerrar la notificación manualmente
  const handleClose = () => {
    dispatch(hideNotification());
  };

  const notificationVariants = {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      x: 0,
      opacity: 1,
      //transition: { duration: 0.1 },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.1 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-24 right-5 bg-white rounded-lg shadow-lg flex items-center justify-start p-2"
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex relative gap-4 pr-12 items-center p-2">
            <div className="">
              {isError ? (
                <InfoPill
                  type={"error"}
                  size={"small"}
                  icon={"delete"}
                  isRadial={true}
                />
              ) : (
                <InfoPill
                  type={"success"}
                  size={"small"}
                  icon={"check"}
                  isRadial={true}
                />
              )}
            </div>

            <div className="flex flex-col text-primary_text_1">
              {isError ? (
                <span className="font-semibold">Error!</span>
              ) : (
                <span className="font-semibold">Éxito!</span>
              )}
              <span className=" font-medium text-sm text-primary_gray_4">
                {message}
              </span>
            </div>

            <button
              className="ml-4 absolute top-2 right-2 text-primary_gray_4"
              onClick={handleClose}
            >
              <MdClose size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
