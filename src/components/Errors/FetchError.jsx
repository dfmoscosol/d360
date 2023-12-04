import React from "react";

import { MdOutlineError } from "react-icons/md";

const FetchError = ({ error }) => {
  console.log(error.error)
  return (
    <>
      <div className="bg-white px-4 py-8 border-l-4 border-l-red-600 flex items-center gap-2 text-red-600">
        <MdOutlineError size={25}/>
        <span className="font-medium ">Error al cargar los datos.</span>
      </div>
    </>
  );
};

export default FetchError;
