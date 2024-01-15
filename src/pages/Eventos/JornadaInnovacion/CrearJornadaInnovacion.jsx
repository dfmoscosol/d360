import React, { useState, useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import { useAddEventoMutation } from "@redux/services/evento/eventoApi";
import { Button } from "@components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

import { ContainerPage } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";
import FormLabel from "../ui/components/FormLabel/FormLabel";

const CrearJornadaInnovacion = () => {
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
    //console.log(data);
    let areValidDates;
    let validDatesList = [];
    let validInputsList = [];

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

    const areAllInputsFilled = inputs.every(
      (input) => input.value.trim() !== ""
    );
    if (!areAllInputsFilled) {
      console.log("ERROR: Todos los talleres deben tener un nombre.");
      inputs.forEach((input) => {
        if (input.value.trim() === "") {
          input.isEmpty = true;
        } else {
          input.isEmpty = false;
        }
      });
    } else {
      console.log("Todos los talleres tienen un nombre.");
      validInputsList = inputs.map((input) => ({ nombre: input.value }));
    }

    let isModalidadPresencial = false;
    if (selectedModalidad === "Presencial") {
      isModalidadPresencial = true;
    }

    if (areValidDates && areAllInputsFilled) {
      console.log("Se puede enviar el formulario");
      data.fechas = validDatesList;
      data.presencial = isModalidadPresencial;
      data.talleres = validInputsList;
      data.allow_inscripcion = false;
      data.allow_asistencia_entrada = false;
      data.allow_asistencia_salida = false;
      data.horas = Number(data.horas);
      data.cupo = Number(data.cupo);
      data.tipo = "jornada";
      //console.log(data);
      console.log("Se enviará el formulario");
      addEvento(data);
      console.log("Enviado");
    } else {
      console.log("No se puede enviar el formulario");
    }
  };

  /**
   * PARA LOS INPUTS DINÁMICOS
   */
  const [inputs, setInputs] = useState([
    {
      id: 1,
      hasAddButton: true,
      hasRemoveButton: false,
      value: "",
      isEmpty: false,
    },
  ]);

  const handleInputChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, value: newValue, isEmpty: false };
        }
        return input;
      })
    );
  };

  const handleAddInput = () => {
    const newInputs = [...inputs];
    const lastInput = newInputs[newInputs.length - 1];
    lastInput.hasAddButton = false;
    lastInput.hasRemoveButton = false;
    newInputs.push({
      id: lastInput.id + 1,
      hasAddButton: true,
      hasRemoveButton: true,
      value: "",
      isEmpty: false,
    });
    setInputs(newInputs);
  };

  const handleRemoveInput = () => {
    const newInputs = [...inputs];
    newInputs.pop();
    const arrLen = newInputs.length;
    const newLastInput = newInputs[newInputs.length - 1];
    if (arrLen > 1) {
      newLastInput.hasAddButton = true;
      newLastInput.hasRemoveButton = true;
    } else {
      newLastInput.hasAddButton = true;
      newLastInput.hasRemoveButton = false;
    }
    setInputs(newInputs);
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
          className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
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
      //console.log(response);
      triggerNotification(dispatch, {
        message: response.respuesta,
        type: "success",
      });
      navigate("/eventos");
    } else if (isError && error) {
      //console.log(error);
      triggerNotification(dispatch, {
        message: error.data.error || "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  return (
    <ContainerPage>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContainerForm>
          {/**Nombre */}
          <div className="md:col-span-8 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Nombre"} />
            <input
              //value="Jornada de Innovación Test"
              type="text"
              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
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
          <div className="md:col-span-4 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Modalidad"} />
            <div className="w-full">
              <ComboBox items={listModalidades} onSelect={handleSelect} />
            </div>
            {/*!isValidModalidad && (
                <span className="text-red-600 text-sm font-light px-1">
                  Seleccione una opción
                </span>
              )*/}
          </div>

          {/**Tutor */}
          <div className="md:col-span-6 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Tutor"} />
            <div className="w-full">
              <input
                type="text"
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
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

          {/**Dirección */}
          <div className="md:col-span-6 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Dirección"} />
            <div className="w-full">
              <input
                type="text"
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("direccion", { required: false })}
                placeholder="Universidad de Cuenca"
              />
            </div>
          </div>

          {/**Fecha */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Fecha"} />
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
          <div className="col-span-3 flex flex-col gap-1">
            <FormLabel value={"Horas"} />
            <div className="w-full">
              <input
                type="number"
                //value={10}
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("horas", { required: true })}
                min={1}
                step={1}
              />
            </div>
            {errors.horas && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Cupos */}
          <div className="col-span-3 flex flex-col gap-1">
            <FormLabel value={"Cupos"} />
            <div className="w-full h-full ">
              <input
                //value={5}
                type="number"
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("cupo", { required: true })}
                min={1}
                step={1}
              />
            </div>
            {errors.cupo && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Talleres */}
          <div className="flex flex-col col-span-12 gap-1">
            <FormLabel value={"Talleres"} />
            <div className="flex flex-col gap-3">
              {inputs.map((input) => (
                <div key={input.id} className="flex gap-4">
                  <div className="flex flex-col w-full bg-white rounded-lg p-3 gap-1 border-[1px]">
                    <span className="text-sm font-medium text-primary_text_1">
                      Nombre del Taller
                    </span>
                    <input
                      type="text"
                      value={input.value}
                      onChange={(e) =>
                        handleInputChange(input.id, e.target.value)
                      }
                      className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                      placeholder={`Taller ${input.id}`}
                      //{...register(`taller_${input.id}`, { required: true })}
                    />
                    {input.isEmpty && (
                      <span className="text-red-600 text-sm font-light px-1">
                        Ingrese un nombre válido
                      </span>
                    )}
                  </div>
                  {input.hasAddButton && (
                    <div className="flex items-center justify-center">
                      <Button
                        type="ucuenca"
                        onClick={handleAddInput}
                        icon={"add"}
                        buttonType={"button"}
                        value={"Atrás"}
                        size={"small"}
                        isRadial={true}
                        isPrimary={false}
                      />
                    </div>
                  )}
                  {input.hasRemoveButton && (
                    <div className="flex items-center justify-center">
                      <Button
                        type="error"
                        onClick={handleRemoveInput}
                        icon={"delete"}
                        buttonType={"button"}
                        size={"small"}
                        isRadial={true}
                        isPrimary={false}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
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
              type="ucuenca"
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

export default CrearJornadaInnovacion;
