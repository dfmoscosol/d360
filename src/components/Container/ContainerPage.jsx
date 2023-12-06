import React from "react";

const ContainerPage = ({ children }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full flex flex-col gap-4 items-start md:max-w-xl rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default ContainerPage;
