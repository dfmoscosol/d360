import React, { useEffect } from "react";

import { MdOutlineError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { logout } from "@redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const FetchError = ({ error }) => {
  console.log(error);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const status = error.status;

  useEffect(() => {
    if (status == 401) {
      console.log("error 401");
      dispatch(logout(true));
      //navigate("/login");
    }
  }, [status, navigate]);

  return (
    <>
      <div className="bg-white px-4 py-8 border-l-4 border-l-red-600 flex items-center gap-2 text-red-600">
        <MdOutlineError size={25} />
        <span className="font-medium ">Error al cargar los datos.</span>
      </div>
    </>
  );
};

export default FetchError;
