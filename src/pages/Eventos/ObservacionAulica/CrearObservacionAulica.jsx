import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import { MdSave } from "react-icons/md";
import { Oval } from "react-loader-spinner";
import { Notification } from "@components";

import { useAddEventoMutation } from "@redux/services/evento/eventoApi";

const CrearObservacionAulica = () => {
  /**
   * PARA LAS SOLICITUDES POST
   */
  const [
    addEvento, // This is the mutation trigger
    { data: response, isLoading: isUpdating, isSuccess, isError, error }, // This is the destructured mutation result
  ] = useAddEventoMutation();

  /**
   * MANUAL VALIDATIONS
   */
  const [isValidDate, setValidDate] = useState(true);

  /**
   * PARA EL FORMULARIO
   */
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
      data.allow_asistencia = true;
      data.horas = Number(data.horas);
      data.cupo = Number(data.cupo);
      data.tipo = "Observación Aulica";
      data.nombre_tutor = ".";
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
   * Para el ComboBox
   */

  // Definir los elementos a seleccionar
  const listModalidades = ["Virtual", "Presencial"];
  // Estado para almacenar el valor seleccionado
  const [selectedModalidad, setSelectedModalidad] = useState("");

  const handleSelect = (value) => {
    setSelectedModalidad(value);
    /*if (value === "") {
      setValidModalidad(false);
      console.log("no válido");
    } else {
      setValidModalidad(true);
      console.log("válido");
    }*/
  };

  /**
   * Para la notificación
   */

  const shouldShowNotification = isSuccess || isError;
  const message = isError ? error?.data.error : response?.respuesta;

  return (
    <>
      <div className="flex justify-center rounded-lg pb-10">
        {shouldShowNotification && (
          <Notification message={message} isError={isError} />
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-10 py-8 rounded-lg grid grid-cols-12 gap-6 w-[600px] bg-white">
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

            {/**Modalidad */}
            <div className="col-span-6 flex flex-col">
              <span className="text-base font-medium text-primary_color_1 ">
                Modalidad
              </span>
              <div className="w-full">
                <ComboBox items={listModalidades} onSelect={handleSelect} />
              </div>
            </div>

            {/**Fecha */}
            <div className="col-span-6 flex flex-col">
              <span className="text-base font-medium text-primary_color_1">
                Fecha
              </span>
              <div className="w-full flex flex-col">
                <DatePicker
                  range
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

            {/**Dirección */}
            <div className="col-span-6 flex flex-col">
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

            {/**Horas */}
            <div className="col-span-3 flex flex-col">
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

            {/**Cupos */}
            <div className="col-span-3 flex flex-col">
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
            <div className="py-4 col-span-12 text-primary_gray_5">
              <hr />
            </div>
            <div className="flex items-center justify-center col-span-12">
              <button
                type="submit"
                className={`${
                  isUpdating
                    ? "bg-primary_color_1_bg_light cursor-not-allowed active:bg-primary_color_1_bg_light"
                    : "bg-primary_color_1 cursor-pointer"
                } flex gap-2 items-center px-3 py-2 text-base font-medium rounded-lg  text-primary_color_1_text_light hover:bg-primary_color_1_bg_light active:bg-primary_color_1 transition duration-200`}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Oval
                    height={24}
                    width={24}
                    color="#cef4ff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#cef4ff"
                    strokeWidth={6}
                    strokeWidthSecondary={2}
                  />
                ) : (
                  <MdSave size={24} />
                )}
                <span>GUARDAR</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CrearObservacionAulica;
