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

import { ContainerPage, InfoPill } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";
import FormLabel from "../ui/components/FormLabel/FormLabel";

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
  const [errorSesiones, setErrorSesiones] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }, unregister
  } = useForm();

  const onSubmit = (data) => {
    let areValidDates;
   
    if (sesiones.length == 0) {
      console.log("ERROR: No se ha elegido más de una fecha.");
      setValidDate(false);
      return;
    } else {
      console.log("Se ha elegido más de una fecha.");
      setValidDate(true);
      areValidDates = true;
    }

    let areValidSesiones = false
    if (sesiones.every(element => element.modalidad !== "" && element.ubicacion !== "" && element.duracion !== "" && element.hora_inicio !== "")) {
      setErrorSesiones(false)
      areValidSesiones = true
    } else {
      setErrorSesiones(true)
      return;
    }

    const areAllPonentesFilled = inputs.every(input => input.value.trim() !== "");

    if (!areAllPonentesFilled) {
      console.log("ERROR: Todos los campos deben estar completos.");
      setInputs(inputs => inputs.map(input => ({
        ...input,
        isEmpty: input.value.trim() === ""
      })));
      return; // Detener la ejecución si algún campo está vacío
    }

    if (isValidDate && areValidSesiones && areAllPonentesFilled) {
      data.inscripcion = false
      data.sesiones = sesiones
      data.ponentes = inputs.map(input => ({
        nombre: input.value,
      }));
      console.log(data)
      addEvento({
        params: data,
        tipo: "microtalleres"
      });
    }

  };

  /**
   * PARA EL DATE PICKER
   */
  const today = new Date();
  const [sesiones, setSesiones] = useState([]);
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
    const selectedDatesSet = new Set(value.map(date => date.format("DD-MM-YYYY")));
    const filteredSessions = sesiones.filter(session => selectedDatesSet.has(session.fecha));
    let newSessions = value.map(date => ({
      fecha: date.format("DD-MM-YYYY"),
      modalidad: '',
      hora_inicio: '',
      duracion: '',
      ubicacion: ''
    }));
    // Añadir las sesiones filtradas a newSessions si no están ya incluidas
    newSessions = newSessions.map(newSession => {
      const existingSession = filteredSessions.find(session => session.fecha === newSession.fecha);
      return existingSession ? existingSession : newSession;
    });
    setSesiones(newSessions)
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
   * PARA LAS SESIONES DINAMICAS
   */

  const listModalidades = ["Virtual", "Presencial", "Híbrida"];
  const handleSelect = (value, fecha) => {
    let numValue = value === "Presencial" ? 1 : value === "Virtual" ? 2 : value === "Híbrida" ? 3 : 0;
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha === fecha);

    // Si se encuentra la sesión, actualizar su modalidad
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].modalidad = numValue;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false)
  };

  const handleUpdateLocation = (value, fecha) => {
    // Obtener las sesiones actuales
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha === fecha);

    // Si se encuentra la sesión, actualizar su ubicación
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].ubicacion = value;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false)
  };

  const handleUpdateHora = (value, fecha) => {
    // Obtener las sesiones actuales
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha === fecha);

    // Si se encuentra la sesión, actualizar su ubicación
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].hora_inicio = value;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false)

  };

  const handleUpdateDuration = (value, fecha) => {
    // Obtener las sesiones actuales
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha === fecha);

    // Si se encuentra la sesión, actualizar su ubicación
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].duracion = value;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false)

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
        message: error.message && "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  return (
    <ContainerPage>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContainerForm>
          {/**Nombre */}
          <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Nombre"} />
            <input
              //value="Jornada de Innovación Test"
              type="text"
              className="focus:bg-white text-primary_gray_4 first:font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
              placeholder=""
              {...register("nombre", { required: true })}
            />
            {errors.nombre && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un nombre válido.
              </span>
            )}
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
                {...register("cupos", { required: true })}
                min={1}
                step={1}
              />
            </div>
            {errors.cupos && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>
          {sesiones.map((sesion, index) => (
            <>
              <div className="col-span-12 flex flex-col gap-1 items-start justify-start">
                <InfoPill
                  value={sesion.fecha}
                  size="small"
                  type="date"
                  icon="date"
                />
              </div>
              <input
                type="hidden"
              />
              {/* Modalidad */}
              <div className="col-span-6 flex flex-col gap-1">
                <FormLabel value={"Modalidad"} />
                <div className="w-full">
                  <ComboBox
                    items={listModalidades}
                    onSelect={(value) => handleSelect(value, sesion.fecha)}
                  />
                </div>
                {errorSesiones && sesion.modalidad === "" && (
                  <span className="text-red-600 text-sm font-light px-1">
                    Seleccione una opción.
                  </span>
                )}
              </div>
              {/* Ubicación */}
              <div className="col-span-6 flex flex-col gap-1">
                <FormLabel value={"Ubicación"} />
                <div className="w-full h-full">
                  <input
                    type="text"
                    value={sesion.ubicacion}
                    onChange={(e) => handleUpdateLocation(e.target.value, sesion.fecha)}
                    className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                  />
                </div>
                {errorSesiones && sesion.ubicacion === "" && (
                  <span className="text-red-600 text-sm font-light px-1">
                    Ingrese un valor válido.
                  </span>
                )}
              </div>

              {/* Hora de inicio */}
              <div className="col-span-6 flex flex-col gap-1">
                <FormLabel value={"Hora de inicio"} />
                <div className="w-full h-full">
                  <input
                    type="time"
                    value={sesion.hora_inicio}
                    onChange={(e) => handleUpdateHora(e.target.value, sesion.fecha)}
                    className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                  />
                </div>
                {errorSesiones && sesion.hora_inicio === "" && (
                  <span className="text-red-600 text-sm font-light px-1">
                    Ingrese un valor válido.
                  </span>
                )}
              </div>

              {/* Duración */}
              <div className="col-span-6 flex flex-col gap-1">
                <FormLabel value={"Duración"} />
                <div className="w-full h-full">
                  <input
                    type="number"
                    value={sesion.duracion}
                    className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                    onChange={(e) => handleUpdateDuration(e.target.value, sesion.fecha)}
                    min={1}
                    step={1}
                  />
                </div>
                {errorSesiones && sesion.duracion === "" && (
                  <span className="text-red-600 text-sm font-light px-1">
                    Ingrese un valor válido.
                  </span>
                )}
              </div>
            </>
          ))}

          <div className="flex flex-col col-span-12 gap-1">
            <FormLabel value={"Ponentes"} />
            <div className="flex flex-col gap-3">
              {inputs.map((input) => (
                <>
                  <div key={input.id} className="flex flex-row justify-between items-center">
                    <div className="bg-white rounded-lg p-3 border-[1px] flex-grow">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-primary_text_1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {input.hasAddButton && (
                        <Button
                          type="ucuenca"
                          onClick={handleAddInput}
                          icon="add"
                          buttonType="button"
                          size="small"
                          isRadial={true}
                          isPrimary={false}
                        />
                      )}
                      {input.hasRemoveButton && (
                        <Button
                          type="error"
                          onClick={handleRemoveInput}
                          icon="delete"
                          buttonType="button"
                          size="small"
                          isRadial={true}
                          isPrimary={false}
                        />
                      )}
                    </div>
                  </div>
                  {input.isEmpty && (
                    <span className="text-red-600 text-sm font-light px-1">
                      Complete todos los campos para el Ponente
                    </span>
                  )}
                </>
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

export default CrearTaller;
