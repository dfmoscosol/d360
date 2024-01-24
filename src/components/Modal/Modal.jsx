import React from "react";

import { Button, InfoPill } from "@components";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  message,
  children,
  onClose,
  type,
  title,
  showCancel,
}) => {
  let icon;
  if (type == "error") {
    icon = (
      <InfoPill type={"error"} size={"small"} icon={"delete"} isRadial={true} />
    );
  } else if (type == "success") {
    icon = (
      <InfoPill
        type={"success"}
        size={"small"}
        icon={"check"}
        isRadial={true}
      />
    );
  }

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.1 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="flex items-center justify-center w-full"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full flex flex-col">
              <div className="flex items-center gap-2">
                {icon}
                <span className="text-primary_text_1 font-semibold text-lg tracking-tight">
                  {title}
                </span>
              </div>
              <span className="text-primary_gray_4 mt-4 text-base tracking-tight">
                {message}
              </span>
              <div className="mt-6 flex justify-end space-x-2">
                {children}
                {showCancel && (
                  <Button
                    value="Cancelar"
                    type="gray"
                    size="medium"
                    icon="close"
                    onClick={onClose}
                    isPrimary={false}
                    //isLoading={isUpdatingEdit}
                    //isRadial={true}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
