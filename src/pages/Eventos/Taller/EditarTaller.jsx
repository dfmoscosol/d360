import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import FormLabel from "../ui/components/FormLabel/FormLabel";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { Link, useNavigate } from "react-router-dom";
import { useEditEventoMutation } from "@redux/services/evento/eventoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { Modal, Button } from "@components";
import { ContainerPage, InfoPill } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";

const EditarTaller = (props) => {
  const {
    cupos,
    fechas,
    horas,
    id,
    nombre,
    currentSesiones,
    ponentes,
    handleRefetch,
  } = props;

  /**
   * REDUX
   */

  const dispatch = useDispatch();

  const [
    editEvento,
    { data: response, isLoading: isUpdating, isSuccess, isError, error }, // This is the destructured mutation result
  ] = useEditEventoMutation();

  /**
   * PARA EL FORMULARIO
   */

  const [isValidDate, setValidDate] = useState(true);
  const [errorSesiones, setErrorSesiones] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // PARA GUARDAR LA DATA DEL FORMULARIO
  const [formData, setFormData] = useState(null);

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

    if (areValidDates && areValidSesiones && areAllPonentesFilled) {
      console.log("Se puede enviar el formulario");
      data.sesiones = sesiones
      data.horas = Number(data.horas);
      data.cupos = Number(data.cupos);
      data.ponentes = inputs.map(input => ({
        nombre: input.value,
      }));
      console.log(data)
       setFormData({
        id: id,
        body: data,
        tipo: "microtalleres"
      });
      setModalOpen(true); 
    } else {
      console.log("No se puede enviar el formulario");
    }
  };

  /**
   * PARA EL DATE PICKER
   */

  const formattedSesiones = currentSesiones.map((sesion) => {
    const parts = sesion.fecha.split("-");
    // Cambia el orden de los elementos para adaptarse al formato MM-DD-YYYY
    const formattedDate = `${parts[1]}-${parts[2]}-${parts[0]}`;
    let datefinal = new DateObject(new Date(formattedDate))
    return {
      fecha: datefinal.format("DD-MM-YYYY"),
      modalidad: Number(sesion.modalidad === "Presencial" ? 1 : sesion.modalidad === "Virtual" ? 2 : sesion.modalidad === "Híbrida" ? 3 : 0),
      ubicacion: sesion.ubicacion,
      hora_inicio: sesion.hora_inicio,
      duracion: Number(sesion.duracion),
    };
  });

  const [sesiones, setSesiones] = useState(formattedSesiones);
  const today = new Date();
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
   * COMBOBOX
   */

  const listModalidades = ["Virtual", "Presencial", "Híbrida"];


  // Estado para almacenar el valor seleccionado

  const handleSelect = (value, fecha) => {
    let numValue = value === "Presencial" ? 1 : value === "Virtual" ? 2 : value === "Híbrida" ? 3 : 0;
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha === fecha);

    // Si se encuentra la sesión, actualizar su modalidad
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].modalidad = Number(numValue);
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
      sesionesActualizadas[sessionIndex].duracion = Number(value);
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false)

  };

  /**
   * PARA ENVIAR EL FORMULARIO
   */
  const handleConfirmEditCapacitacion = () => {
    console.log("Se enviará el formulario xxxx");
    console.log(formData);
    editEvento(formData);
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
      handleRefetch();
      navigate(-1);
    } else if (isError && error) {
      console.log(error);
      triggerNotification(dispatch, {
        message: error.message || "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  /**
     * PARA LOS INPUTS DINÁMICOS
     */

  let allPonentesList = [];

  ponentes.forEach((ponente, index) => {
    const nuevoPonente = {
      id: index + 1,
      hasAddButton: index === ponentes.length - 1,
      hasRemoveButton: index === ponentes.length - 1,
      value: ponente,
      isEmpty: false,
    };
    allPonentesList.push(nuevoPonente);
  });

  const [inputs, setInputs] = useState(allPonentesList);

  const handleInputChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, value: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }

  const handleAddInput = () => {
    const newInputs = inputs.map(input => ({
      ...input,
      hasAddButton: false,
      hasRemoveButton: false
    }));

    newInputs.push({
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

    if (newInputs.length > 0) {
      const lastInput = newInputs[newInputs.length - 1];
      lastInput.hasAddButton = true;
      lastInput.hasRemoveButton = true;
    }

    setInputs(newInputs);
  };
  /**
   * PARA EL MODAL
   */
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <ContainerPage>
      <Modal
        isOpen={isModalOpen}
        message="¿Desea guardar los cambios?"
        onClose={() => setModalOpen(false)}
        type={"success"}
        title={"Editar evento"}
        showCancel={!isSuccess}
      >
        {isSuccess ? (
          <Link to="/eventos">
            <Button
              value="Actualización exitosa"
              type="success"
              size="medium"
              icon="check"
              isPrimary={true}
            />
          </Link>
        ) : (
          <Button
            value="Guardar"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={handleConfirmEditCapacitacion}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ContainerForm>
          {/**Nombre */}
          <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Nombre"} />
            <input
              value={nombre}
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
                value={sesiones.map((sesion) => sesion.fecha)}
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
                defaultValue={horas}
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
                defaultValue={cupos}
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
                    selected={sesion.modalidad === 1? "Presencial" : sesion.modalidad ===  2 ? "Virtual"  : sesion.modalidad ===  3 ? "Híbrida"  : ""}
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

export default EditarTaller;
