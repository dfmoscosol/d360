import React from "react";

const ContainerFormModal = ({ extra, children }) => {
  return (
    <div
      className={`px-4 md:px-10 rounded-lg grid grid-cols-12 gap-6 bg-white w-full md:max-w-xl ${extra}`}
    >
      {children}
    </div>
  );
};

export default ContainerFormModal;
