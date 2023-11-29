import React from "react";

import { MdOutlineError } from "react-icons/md";

const FetchError = ({ error }) => {
  console.log(error.error)
  return (
    <>
      <div className="bg-red-50 p-4 border border-red-200 rounded-lg flex items-center gap-2 text-primary_color_2">
        <MdOutlineError size={25}/>
        <span className="font-medium ">Error al cargar los datos.</span>
      </div>
    </>
  );
};

export default FetchError;
