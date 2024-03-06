import React, { useEffect } from "react";

import LOGO from "@assets/logo.svg";
import { useForm } from "react-hook-form";
import { Button, InfoPill } from "@components";
import { useLoginMutation } from "@redux/services/login/loginApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { login } from "@redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import FormLabel from "../Eventos/ui/components/FormLabel/FormLabel";

const Login = () => {
  /**
   * REDUX AND NAVIGATION
   */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * URL PARAMS
   */
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from"); // Obtén la ruta a la que el usuario intentaba acceder
  const expired = queryParams.get("expired"); // Verifica si el usuario fue redirigido

  console.log(from);
  console.log(expired);

  /**
   * PARA EL LOGIN
   */
  const [
    loginUser,
    { data: response, isLoading: isUpdating, isSuccess, isError, error },
  ] = useLoginMutation();

  // Data del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Enviar los datos al servidor
  const onSubmit = (data) => {
    loginUser(data);
  };

  useEffect(() => {
    if (isSuccess) {
      // Almacenar el token en Local Storage
      localStorage.setItem("token", response.respuesta.access_token);
      // Guardar el token también en el estado de Redux
      dispatch(login(response.respuesta.access_token));

      console.log("token guardado en local storage");

      // Redirige a la página principal

      /*if (expired) {
        console.log("redirigiendo a " + from);
        navigate(from, { replace: true });
      } else {
        console.log("not expired");
        navigate("/");
      }*/

      // Redirige al usuario a la ruta 'from' si está disponible, de lo contrario a la página principal
      const redirectTo = from || "/";
      navigate(redirectTo, { replace: true });
    } else if (isError && error) {
      console.log(error);
      triggerNotification(dispatch, {
        message: error.data.error || "Error al iniciar sesión.",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  /**
   * REDIRECCIONAMIENTO
   */

  /*
  const token = useSelector((state) => state.authState.token);
  const hasExpired = useSelector((state) => state.authState.hasExpired);

  useEffect(() => {
    // Si el token ya existe, redirigir a la página principal
    if (token) {
      console.log("token existe");
      console.log("navegando a /");
      navigate("/");
    }
  }, [token, navigate]);*/

  return (
    <div className="w-full md:w-96 flex flex-col h-full items-center border border-primary_gray_5 rounded-lg py-4 px-10">
      <div>
        <img
          src={LOGO}
          alt="Dirección de Innovación - Universidad de Cuenca"
          className="h-20"
        />
      </div>

      {expired && (
        <div className="mt-4">
          <InfoPill
            type={"info"}
            value={"Sesión Expirada"}
            icon={"info"}
            size={"medium"}
          />
        </div>
      )}

      <span className="my-5 text-xl font-semibold text-primary_gray_4">
        Iniciar Sesión
      </span>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/**Nombre */}
        <div className="bg-red-0 w-full flex flex-col">
          <FormLabel value={"Nombre"} />
          <input
            //value="Jornada de Innovación Test"
            type="text"
            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
            {...register("correo", { required: true })}
          />
          {errors.correo && (
            <span className="text-red-600 text-sm font-light px-1">
              Ingrese un nombre de usuario válido.
            </span>
          )}
        </div>

        {/**Contraseña */}
        <div className="bg-red-0 w-full flex flex-col mt-4">
          <FormLabel value={"Contraseña"} />
          <input
            //value="Jornada de Innovación Test"
            type="password"
            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
            {...register("contrasena", { required: true })}
          />
          {errors.contrasena && (
            <span className="text-red-600 text-sm font-light px-1">
              Ingrese una contraseña válida.
            </span>
          )}
        </div>

        {/**Footer */}
        <div className="w-full text-primary_gray_5 mt-8">
          <hr />
        </div>

        {/**Buttons */}
        <div className="flex items-center justify-center mt-4">
          <Button
            type="ucuenca"
            icon={"login"}
            buttonType={"submit"}
            value={"Iniciar Sesión"}
            size={"medium"}
            isLoading={isUpdating}
            isPrimary={true}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
