import React from "react";

import { MdCheckCircle, MdClose, MdError } from "react-icons/md";

const Modal = ({ isOpen, message, children, onClose, type, title }) => {
  if (!isOpen) return null;

  let icon;
  if (type == "error") {
    icon = (
      <div className="bg-red-100 p-2 items-center rounded-full">
        <MdError size={25} className="text-red-500" />
      </div>
    );
  }

  return (
    <div>

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
            <button
              className="px-3 py-2 rounded-lg hover:bg-primary_gray_1 border border-primary_gray_2 bg-white text-primary-gray-4 transition-all duration-100"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
