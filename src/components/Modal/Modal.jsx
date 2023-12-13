import React from "react";

import { MdCheckCircle, MdClose, MdError } from "react-icons/md";
import { Button, InfoPill } from "@components";

const Modal = ({
  isOpen,
  message,
  children,
  onClose,
  type,
  title,
  showCancel,
}) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-brightness-90">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full flex flex-col">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-primary_color_1 font-semibold text-lg">
            {title}
          </span>
        </div>
        <span className="text-primary_gray_4 mt-4 text-base">{message}</span>
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
    </div>
  );
};

export default Modal;
