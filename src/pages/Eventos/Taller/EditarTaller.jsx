import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import MultiSelectComboBox from "../ui/components/MultiSelectComboBox/MultiSelectComboBox";
import { useGetCompetenciasQuery } from "@redux/services/competencia/competenciaApi";
import FormLabel from "../ui/components/FormLabel/FormLabel";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
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
    descripcion,
    competencias,
    momento,
    microcredencial,
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // PARA GUARDAR LA DATA DEL FORMULARIO
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    setIsSubmitted(true);
    let areValidDates;

    if (sesiones.length == 0) {
      console.log("ERROR: No se ha elegido más de una fecha.");
      setValidDate(false);
      triggerNotification(dispatch, {
        message: "Por favor, complete todos los campos requeridos correctamente.",
        type: "error",
      });
      return;
    } else {
      console.log("Se ha elegido más de una fecha.");
      setValidDate(true);
      areValidDates = true;
    }

    let areValidSesiones = false
    if (sesiones.length > 0 && sesiones.every(element => element.modalidad !== "" && element.ubicacion !== "" && element.duracion !== "" && element.hora_inicio !== "")) {
      setErrorSesiones(false)
      areValidSesiones = true
    } else {
      setErrorSesiones(true)
      triggerNotification(dispatch, {
        message: "Por favor, complete todos los campos requeridos correctamente.",
        type: "error",
      });
      return;
    }

    const areAllPonentesFilled = inputs.every(input => input.value.trim() !== "");

    if (!areAllPonentesFilled) {
      console.log("ERROR: Todos los campos deben estar completos.");
      setInputs(inputs => inputs.map(input => ({
        ...input,
        isEmpty: input.value.trim() === ""
      })));
      triggerNotification(dispatch, {
        message: "Por favor, complete todos los campos requeridos correctamente.",
        type: "error",
      });
      return; // Detener la ejecución si algún campo está vacío
    }

    const validDatesList = dates.map(d => d.format("YYYY-MM-DD"));
    const unassignedDates = validDatesList.filter(date => !sesiones.some(s => s.fecha_id === date));
    if (unassignedDates.length > 0) {
      triggerNotification(dispatch, {
        message: `La fecha ${unassignedDates[0]} no tiene ninguna sesión asignada.`,
        type: "error",
      });
      return;
    }
    const orphanedSessions = sesiones.filter(s => !validDatesList.includes(s.fecha_id));
    if (orphanedSessions.length > 0) {
      triggerNotification(dispatch, {
        message: `Hay sesiones asignadas a fechas que ya no están seleccionadas (${orphanedSessions[0].fecha_id}). Elimínelas.`,
        type: "error",
      });
      return;
    }

    if (areValidDates && areValidSesiones && selectedCompetencias.length > 0 && isTotalValid && selectedMomento != "" && areAllPonentesFilled) {
      console.log("Se puede enviar el formulario");
      data.inscripcion = false;
      data.competencias = selectedCompetencias.map(c => ({ id: c.id, horas: Number(c.horas || 0) }));
      data.momento = listMomentos.indexOf(selectedMomento) + 1;
      data.fechas = dates.map(d => d.format("YYYY-MM-DD"));
      data.sesiones = sesiones.map(sesion => ({
        fecha_id: sesion.fecha_id,
        hora_inicio: sesion.hora_inicio,
        duracion: Number(sesion.duracion),
        modalidad: listModalidades.indexOf(sesion.modalidad) + 1,
        ubicacion: sesion.ubicacion
      }));
      data.horas = Number(data.horas);
      data.cupos = Number(data.cupos);
      data.ponentes = inputs.map(input => ({
        nombre: input.value,
      }));
      console.log(data);
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
    let datefinal = new DateObject(new Date(formattedDate));
    const modText = sesion.modalidad === 1 || sesion.modalidad === "Presencial" ? "Presencial" : 
                    sesion.modalidad === 2 || sesion.modalidad === "Virtual" ? "Virtual" : 
                    sesion.modalidad === 3 || sesion.modalidad === "Híbrida" ? "Híbrida" : 
                    (sesion.modalidad || "Presencial");
    return {
      fecha_id: datefinal.format("YYYY-MM-DD"),
      modalidad: modText,
      ubicacion: sesion.ubicacion,
      hora_inicio: sesion.hora_inicio,
      duracion: Number(sesion.duracion),
    };
  });

  const [sesiones, setSesiones] = useState(formattedSesiones);
  const [dates, setDates] = useState(() => {
    return formattedSesiones.map(s => new DateObject(s.fecha_id));
  });
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
    setDates(value);
    setValidDate(value.length > 0);
    const selectedDatesSet = new Set(value.map(date => date.format("YYYY-MM-DD")));
    setSesiones(prev => prev.filter(session => selectedDatesSet.has(session.fecha_id)));
  }

  const handleDateSwap = (oldFecha, newFecha) => {
    setSesiones(prev => prev.map(s => {
      if (s.fecha_id === oldFecha) {
        return { ...s, fecha_id: newFecha };
      }
      return s;
    }));
  };

  const handleAddSession = () => {
    const usedDates = new Set(sesiones.map(s => s.fecha_id));
    const allDates = dates.map(d => d.format("YYYY-MM-DD"));
    const availableDate = allDates.find(d => !usedDates.has(d));
    
    if (availableDate) {
      setSesiones([...sesiones, {
        fecha_id: availableDate,
        modalidad: "Presencial",
        hora_inicio: "",
        duracion: "",
        ubicacion: ""
      }]);
    }
  };

  const handleRemoveSession = (fecha) => {
    setSesiones(prev => prev.filter(s => s.fecha_id !== fecha));
  };

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

  const listModalidades = ["Presencial", "Virtual", "Híbrida"];
  const listMomentos = ["Explorador", "Integrador", "Innovador"];

  const { data: competenciasList = [] } = useGetCompetenciasQuery();

  const [selectedCompetencias, setSelectedCompetencias] = useState(() => {
    if (Array.isArray(competencias)) {
      return competencias.map(c => ({
        ...c,
        id: Number(c.id || c.competencia_id || c.id_competencia),
        horas: Number(c.horas || 0)
      }));
    }
    return [];
  });
  const [isValidCompetencia, setIsValidCompetencia] = useState(true);
  const handleSelectCompetencia = (items) => {
    const newItems = items.map(item => {
      const existing = selectedCompetencias.find(c => c.id === Number(item.id));
      return existing ? existing : { ...item, id: Number(item.id), horas: 0 };
    });
    setSelectedCompetencias(newItems);
    setIsValidCompetencia(newItems.length > 0);
  };
  const handleHorasChange = (id, value) => {
    const intValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const horasTotales = Number(watch("horas") || horas || 0);
    const sumaOtras = selectedCompetencias.filter(c => c.id !== id).reduce((sum, c) => sum + Number(c.horas || 0), 0);
    const maxAllowed = Math.max(0, horasTotales - sumaOtras);
    const finalValue = Math.min(intValue, maxAllowed);
    setSelectedCompetencias(prev => prev.map(c => c.id === id ? { ...c, horas: finalValue } : c));
  };
  
  const horasTotales = Number(watch("horas") || horas || 0);
  const sumaHoras = selectedCompetencias.reduce((sum, c) => sum + Number(c.horas || 0), 0);
  const hasInvalidHoras = selectedCompetencias.some(c => Number(c.horas || 0) <= 0);
  const isTotalValid = sumaHoras === horasTotales && !hasInvalidHoras && horasTotales > 0;

  const [selectedMomento, setSelectedMomento] = useState(momento);
  const [isValidMomento, setIsValidMomento] = useState(true);
  const handleSelectMomento = (value) => {
    setSelectedMomento(value);
    setIsValidMomento(true);
  };

  // Estado para almacenar el valor seleccionado

  const handleSelect = (value, fecha) => {
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha_id === fecha);

    // Si se encuentra la sesión, actualizar su modalidad
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].modalidad = value;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false);
  };

  const handleUpdateLocation = (value, fecha) => {
    // Obtener las sesiones actuales
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha_id === fecha);

    // Si se encuentra la sesión, actualizar su ubicación
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].ubicacion = value;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false);
  };

  const handleUpdateHora = (value, fecha) => {
    // Obtener las sesiones actuales
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha_id === fecha);

    // Si se encuentra la sesión, actualizar su ubicación
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].hora_inicio = value;
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false);
  };

  const handleUpdateDuration = (value, fecha) => {
    // Obtener las sesiones actuales
    let sesionesActualizadas = [...sesiones];

    // Encontrar la sesión correspondiente a la fecha
    const sessionIndex = sesionesActualizadas.findIndex(session => session.fecha_id === fecha);

    // Si se encuentra la sesión, actualizar su ubicación
    if (sessionIndex !== -1) {
      sesionesActualizadas[sessionIndex].duracion = Number(value);
    } else {
      console.error(`No se encontró una sesión para la fecha: ${fecha}`);
    }

    // Actualizar el estado de sesiones
    setSesiones(sesionesActualizadas);
    setErrorSesiones(false);
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
        message: error?.data?.error || "Error al editar el taller",
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
  };

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

      <form onSubmit={handleSubmit(onSubmit, () => {
        setIsSubmitted(true);
        triggerNotification(dispatch, {
          message: "Por favor, complete todos los campos requeridos correctamente.",
          type: "error",
        });
      })}>
        <ContainerForm>
          {/**Nombre */}
          <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Nombre"} />
            <input
              defaultValue={nombre}
              type="text"
              className="focus:bg-white text-primary_gray_4 first:font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
              placeholder=""
              {...register("nombre", { required: true })}
            />
            {isSubmitted && errors.nombre && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un nombre válido.
              </span>
            )}
          </div>
          {/**Descripcion */}
          <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Descripción"} />
            <textarea
              defaultValue={descripcion}
              type="text"
              className="focus:bg-white text-primary_gray_4 first:font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
              placeholder=""
              {...register("descripcion", { required: true })}
            />
            {isSubmitted && errors.descripcion && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese una descripción válida.
              </span>
            )}
          </div>

          {/**Momento */}
          <div className="md:col-span-6 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Momento"} />
            <div className="w-full">
              <ComboBox items={listMomentos} onSelect={handleSelectMomento} hasBeenSelected={true}
                selected={selectedMomento} />
            </div>
            {isSubmitted && !isValidMomento && (
              <span className="text-red-600 text-sm font-light px-1">
                Seleccione una opción
              </span>
            )}
          </div>

          {/**Microcredencial */}
          <div className="md:col-span-6 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Microcredencial (Opcional)"} />
            <input
              type="text"
              maxLength={100}
              defaultValue={microcredencial || ""}
              placeholder="Microcredencial"
              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
              {...register("microcredencial")}
            />
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
            {isSubmitted && errors.horas && (
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
            {isSubmitted && errors.cupos && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Competencias - full width */}
          <div className="col-span-12 flex flex-col gap-1">
            <FormLabel value={"Competencias"} />
            <div className="w-full">
              <MultiSelectComboBox
                items={competenciasList}
                selectedItems={selectedCompetencias}
                onSelectionChange={handleSelectCompetencia}
              />
            </div>
            {isSubmitted && !isValidCompetencia && (
              <span className="text-red-600 text-sm font-light px-1">
                Seleccione al menos una competencia
              </span>
            )}
            {selectedCompetencias.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 p-3 bg-primary_gray_1 rounded-lg w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary_text_1">Asignar horas</span>
                  <span className={`text-sm font-medium ${isTotalValid ? 'text-green-600' : 'text-primary_gray_4'}`}>
                    Total: {sumaHoras} / {horasTotales} hrs
                  </span>
                </div>
                {selectedCompetencias.map(comp => (
                  <div key={comp.id} className="flex justify-between items-center gap-2">
                    <span className="text-sm text-primary_text_1">{comp.nombre}</span>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        value={comp.horas === 0 ? '' : comp.horas} 
                        onChange={(e) => handleHorasChange(comp.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (['.', ',', '-', 'e', 'E'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="w-20 focus:bg-white text-primary_gray_4 p-1 rounded text-sm bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                        min={0} max={horasTotales || 100}
                        step={1}
                      />
                      <span className="text-sm text-primary_gray_4">hrs</span>
                    </div>
                  </div>
                ))}
                {isSubmitted && hasInvalidHoras && (
                  <span className="text-red-600 text-xs mt-1 font-light">Asigne un valor mayor a 0 a todas las competencias.</span>
                )}
                {isSubmitted && !isTotalValid && !hasInvalidHoras && horasTotales > 0 && (
                  <span className="text-red-600 text-xs mt-1 font-light">La suma de horas de las competencias ({sumaHoras}) debe ser igual al total de horas del evento ({horasTotales}).</span>
                )}
                {isSubmitted && horasTotales === 0 && (
                  <span className="text-red-600 text-xs mt-1 font-light">Primero debe ingresar las Horas totales del evento.</span>
                )}
              </div>
            )}
          </div>

          {/**Fecha - Global Picker */}
          <div className="col-span-12 flex flex-col gap-1">
            <FormLabel value={"Fechas"} />
            <div className="w-full flex flex-col">
              <DatePicker
                multiple
                plugins={[<DatePanel />]}
                weekStartDayIndex={1}
                showOtherDays={true}
                weekDays={weekDays}
                months={months}
                onChange={handleDateChange}
                value={dates}
                style={{
                  width: "100%",
                  backgroundColor: "#F9FAFB",
                  color: "#9CA3AF",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  border: "none",
                }}
                render={<CustomInput />}
              />
              {!isValidDate && isSubmitted && (
                <span className="text-red-600 text-sm font-light px-1">
                  Ingrese al menos una fecha.
                </span>
              )}
            </div>
          </div>

          {/**Sesiones */}
          <div className="col-span-12 flex flex-col gap-4">
            {(() => {
              const allDates = dates.map(d => d.format("YYYY-MM-DD"));
              const usedDates = sesiones.map(s => s.fecha_id);
              const hasAvailableDates = allDates.length > usedDates.length;

              return (
                <div className="flex flex-col gap-4 w-full">
                  {sesiones.map((sesion, index) => {
                    const availableDatesForThisSession = allDates.filter(d => !usedDates.includes(d) || d === sesion.fecha_id).sort();

                    return (
                      <div key={`${sesion.fecha_id}-${index}`} className="flex flex-col gap-3 p-4 bg-primary_gray_1 rounded-lg border border-gray-200 relative">
                        {sesiones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSession(sesion.fecha_id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm"
                            title="Eliminar sesión"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        <div className="flex flex-col items-start justify-start w-full">
                          <label className="text-sm font-medium text-primary_text_1 mb-1">Fecha</label>
                          <ComboBox
                            items={availableDatesForThisSession}
                            onSelect={(value) => { if (value !== sesion.fecha_id) handleDateSwap(sesion.fecha_id, value); }}
                            selected={sesion.fecha_id}
                          />
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Modalidad</label>
                            <ComboBox
                              items={listModalidades}
                              onSelect={(value) => handleSelect(value, sesion.fecha_id)}
                              selected={sesion.modalidad}
                            />
                            {isSubmitted && errorSesiones && (!sesion.modalidad || sesion.modalidad === "") && (
                              <span className="text-red-600 text-sm font-light px-1">Seleccione una opción.</span>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Hora</label>
                            <input type="time"
                              value={sesion.hora_inicio}
                              onChange={(e) => handleUpdateHora(e.target.value, sesion.fecha_id)}
                              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5" />
                            {isSubmitted && errorSesiones && sesion.hora_inicio === "" && (
                              <span className="text-red-600 text-sm font-light px-1">Ingrese un valor.</span>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Duración</label>
                            <input type="number"
                              value={sesion.duracion}
                              onChange={(e) => handleUpdateDuration(e.target.value, sesion.fecha_id)}
                              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5" />
                            {isSubmitted && errorSesiones && sesion.duracion === "" && (
                              <span className="text-red-600 text-sm font-light px-1">Ingrese un valor.</span>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Ubicación</label>
                            <input type="text"
                              value={sesion.ubicacion}
                              onChange={(e) => handleUpdateLocation(e.target.value, sesion.fecha_id)}
                              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5" />
                            {isSubmitted && errorSesiones && sesion.ubicacion === "" && (
                              <span className="text-red-600 text-sm font-light px-1">Ingrese un valor.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {hasAvailableDates && (
                    <div className="flex justify-start items-center gap-2">
                      <span className="text-sm font-medium text-primary_text_1">Agregar Sesión</span>
                      <Button
                        type="ucuenca"
                        onClick={handleAddSession}
                        icon="add"
                        buttonType="button"
                        size="small"
                        isRadial={true}
                        isPrimary={false}
                      />
                    </div>
                  )}
                  {isSubmitted && sesiones.length === 0 && (
                    <span className="text-red-600 text-sm font-light px-1">
                      Agregue al menos una sesión.
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

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
                  {isSubmitted && input.isEmpty && (
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
              isDisabled={selectedCompetencias.length === 0 || !isTotalValid}
              isPrimary={true}
            />
          </div>
        </ContainerForm>
      </form>
    </ContainerPage>
  );
};

export default EditarTaller;
