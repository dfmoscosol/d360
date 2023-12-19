import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAddEventoMutation } from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { Button } from "@components";

import { ContainerPage } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";

const CrearTaller = () => {
  /**
   * REDUX
   */
  const dispatch = useDispatch();

  const [
    addEvento,
    { data: response, isLoading: isUpdating, isSuccess, isError, error },
  ] = useAddEventoMutation();

  /**
   * PARA EL FORMULARIO
   */

  const [isValidDate, setValidDate] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    let areValidDates;
    let validDatesList = [];

    if (dates.length == 0) {
      console.log("ERROR: No se ha elegido más de una fecha.");
      setValidDate(false);
      areValidDates = false;
    } else {
      console.log("Se ha elegido más de una fecha.");
      setValidDate(true);
      areValidDates = true;
      dates.sort((a, b) => a - b);
      dates.forEach((date) => {
        validDatesList.push(date.format("DD-MM-YYYY"));
      });
    }

    let isModalidadPresencial = false;
    if (selectedModalidad === "Presencial") {
      isModalidadPresencial = true;
    }

    if (areValidDates) {
      console.log("Se puede enviar el formulario");
      data.fechas = validDatesList;
      data.presencial = isModalidadPresencial;
      data.allow_inscripcion = false;
      data.allow_asistencia_entrada = false;
      data.allow_asistencia_salida = false;
      data.horas = Number(data.horas);
      data.cupo = Number(data.cupo);
      data.tipo = "taller";
      console.log(data);
      console.log("Se enviará el formulario");
      addEvento(data);
      console.log("Enviado");
    } else {
      console.log("No se puede enviar el formulario");
    }
  };

  /**
   * PARA EL DATE PICKER
   */
  const today = new Date();
  const [dates, setDates] = useState([]);
  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  function handleDateChange(value) {
    setDates(value);
    if (value.length > 0) {
      setValidDate(true);
    }
  }

  function CustomInput({ onFocus, value, onChange }) {
    return (
      <>
        <input
          onFocus={onFocus}
          value={value}
          readOnly
          type="text"
          className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
          placeholder=""
          onChange={onChange}
        />
      </>
    );
  }

  /**
   * COMBOBOX
   */
  const listModalidades = ["Virtual", "Presencial"];
  const [selectedModalidad, setSelectedModalidad] = useState("");
  const handleSelect = (value) => {
    setSelectedModalidad(value);
  };

  /**
   * PARA LA NOTIFICACION
   */
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      console.log(response);
      triggerNotification(dispatch, {
        message: response.respuesta,
        type: "success",
      });
      navigate("/eventos");
    } else if (isError && error) {
      console.log(error);
      triggerNotification(dispatch, {
        message: error.message || "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  return (
    <ContainerPage>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContainerForm>
          {/**Nombre */}
          <div className="col-span-12 flex flex-col">
            <span className="text-base font-medium text-primary_color_1">
              Nombre
            </span>
            <input
              //value="Jornada de Innovación Test"
              type="text"
              className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
              placeholder="Jornada 1"
              {...register("nombre", { required: true })}
            />
            {errors.nombre && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un nombre válido.
              </span>
            )}
          </div>

          {/**Tutor */}
          <div className="col-span-5 flex flex-col">
            <span className="text-base font-medium text-primary_color_1 ">
              Tutor
            </span>
            <div className="w-full">
              <input
                type="text"
                //value="Ing. Juan Perez"
                className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
                placeholder="Ing. Juan Perez"
                {...register("nombre_tutor", { required: true })}
              />
            </div>
            {errors.nombre_tutor && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido.
              </span>
            )}
          </div>

          {/**Fecha */}
          <div className="col-span-5 flex flex-col">
            <span className="text-base font-medium text-primary_color_1">
              Fecha
            </span>
            <div className="w-full flex flex-col">
              <DatePicker
                multiple
                plugins={[<DatePanel />]}
                weekStartDayIndex={1}
                showOtherDays={true}
                minDate={today}
                weekDays={weekDays}
                months={months}
                onChange={handleDateChange}
                style={{
                  width: "100%",
                }}
                format="DD-MM-YYYY"
                render={<CustomInput />}
              />
              {!isValidDate && (
                <span className="text-red-600 text-sm font-light px-1">
                  Ingrese una fecha válida.
                </span>
              )}
            </div>
          </div>

          {/**Horas */}
          <div className="col-span-2 flex flex-col">
            <span className="text-base font-medium text-primary_color_1 ">
              Horas
            </span>
            <div className="w-full">
              <input
                type="number"
                //value={10}
                className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
                {...register("horas", { required: true })}
              />
            </div>
            {errors.horas && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Modalidad */}
          <div className="col-span-5 flex flex-col">
            <span className="text-base font-medium text-primary_color_1 ">
              Modalidad
            </span>
            <div className="w-full">
              <ComboBox items={listModalidades} onSelect={handleSelect} />
            </div>
            {/*!isValidModalidad && (
                <span className="text-red-600 text-sm font-light px-1">
                  Seleccione una opción
                </span>
              )*/}
          </div>

          {/**Dirección */}
          <div className="col-span-5 flex flex-col">
            <span className="text-base font-medium text-primary_color_1 ">
              Dirección
            </span>
            <div className="w-full">
              <input
                type="text"
                className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
                {...register("direccion", { required: false })}
              />
            </div>
          </div>

          {/**Cupos */}
          <div className="col-span-2 flex flex-col">
            <span className="text-base font-medium text-primary_color_1 ">
              Cupos
            </span>
            <div className="w-full h-full ">
              <input
                //value={5}
                type="number"
                className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
                {...register("cupo", { required: true })}
              />
            </div>
            {errors.cupo && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Footer */}
          <div className="col-span-12 text-primary_gray_5">
            <hr />
          </div>

          {/**Buttons */}
          <div className="flex items-center justify-center col-span-12 gap-4">
            <Button
              type="gray"
              onClick={() => navigate(-1)}
              icon={"left"}
              buttonType={"button"}
              value={"Atrás"}
              size={"medium"}
            />
            <Button
              type="success"
              icon={"save"}
              buttonType={"submit"}
              value={"Guardar"}
              size={"medium"}
              isLoading={isUpdating}
              isPrimary={true}
            />
          </div>
        </ContainerForm>
      </form>
    </ContainerPage>
  );
};

export default CrearTaller;
