import React, { useState, useEffect } from "react";

import { MdCheckCircle, MdClose } from "react-icons/md";

const Notification = ({ isError, message }) => {
  const [visible, setVisible] = useState(true);

  // Cerrar la notificación después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Función para cerrar la notificación manualmente
  const handleClose = () => {
    setVisible(false);
  };

  // Renderizar condicionalmente en base a `visible`
  if (!visible) return null;

  return (
    <div
      className={`absolute top-24 right-5 bg-white rounded-lg shadow-lg border border-primary_gray_1 ${
        isError ? "border-r border-red-500" : ""
      }  rounded flex items-center justify-start`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex relative gap-2 py-6 pl-4 pr-12">
        <MdCheckCircle size={20} className="text-green-700" />
        <span className="text-primary_color_1 font-medium text-sm">
          {message}
        </span>
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
