import React from "react";

const ContainerPage = ({ extra, children }) => {
  return (
    <div className={`flex flex-col items-center w-full rounded-lg ${extra}`}>
      {children}
    </div>
  );
};

export default ContainerPage;
