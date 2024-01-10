import React, { useEffect } from "react";

import { MdOutlineError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { logout, setHasExpired } from "@redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const FetchError = ({ error }) => {
  console.log(error);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const status = error.status;
  let msg = error.data.msg;

  if (status === 401) {
    dispatch(setHasExpired(true));
  }

  if (status === 404) {
    //dispatch(logout());
    msg = error.data.error;
  }

  /*
  console.log(msg)

  useEffect(() => {
    if (msg == "Token has expired") {
      console.log("Token has expired");
      //dispatch(setHasExpired(true));
      //navigate("/login");
    }
  }, [status, navigate]);*/

  return (
    <>
      <div className="px-4 py-8 border rounded-lg bg-white border-red-200 flex items-center gap-4 text-red-600">
        <MdOutlineError size={20} />
        <div className="flex flex-col gap-0">
          <span className="font-medium ">
            Error al cargar los datos.
          </span>
          <div className="text-sm text-primary_gray_2">{msg}</div>
        </div>
      </div>
    </>
  );
};

export default FetchError;
