import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-4 p-4 rounded-lg border border-primary_gray_5 border-dashed animate-pulse">
        <div className="flex gap-2 items-center justify-center">
          <Oval
            height={30}
            width={30}
            color="#002856"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#002856"
            strokeWidth={6}
            strokeWidthSecondary={2}
          />
          <span className="font-medium text-lg text-primary_color_1">
            Cargando...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
