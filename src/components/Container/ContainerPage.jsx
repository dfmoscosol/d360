import React from "react";

const ContainerPage = ({ children }) => {
  return (
    <div className="flex justify-center w-full rounded-lg">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ContainerPage;
