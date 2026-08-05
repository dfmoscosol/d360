import React, { useState, useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import MultiSelectComboBox from "../ui/components/MultiSelectComboBox/MultiSelectComboBox";
import { useGetCompetenciasQuery } from "@redux/services/competencia/competenciaApi";
import { useAddEventoMutation } from "@redux/services/evento/eventoApi";
import { Button } from "@components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

import { ContainerPage, InfoPill } from "@components";
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
    console.log(inputs);
    if (dates.length === 0) {
      console.log("ERROR: No se ha elegido más de una fecha.");
      setValidDate(false);
      return; // Detener la ejecución si no hay fechas
    }

    console.log("Se ha elegido más de una fecha.");
    setValidDate(true);
    dates.sort((a, b) => a - b);
    const validDatesList = dates.map(date => date.format("YYYY-MM-DD"));

    const areAllInputsFilled = inputs.every(input =>
      input.value.trim() !== "" &&
      input.descripcion.trim() !== "" &&
      input.competencias.length > 0 &&
      input.momento.trim() !== "" &&
      input.sesiones.every(sesion =>
        sesion.fecha_id &&
        sesion.modalidad.trim() !== "" &&
        (sesion.modalidad === "Sin Sesión" || (
          sesion.hora_inicio.trim() !== "" &&
          sesion.duracion.trim() !== "" &&
          sesion.ubicacion.trim() !== ""
        ))
      ) &&
      input.ponentes.every(ponente => ponente.value.trim() !== "")
    );

    if (!areAllInputsFilled) {
      console.log("ERROR: Todos los campos deben estar completos.");
      setInputs(inputs => inputs.map(input => ({
        ...input,
        isEmpty: input.value.trim() === "" || input.descripcion.trim() === "" || input.competencias.length === 0 || input.momento.trim() === "" || input.sesiones.some(sesion =>
          !sesion.fecha_id || sesion.hora_inicio.trim() === "" ||
          sesion.duracion.trim() === "" || sesion.modalidad.trim() === "" ||
          sesion.ubicacion.trim() === ""
        )
      })));
      return; // Detener la ejecución si algún campo está vacío
    }

    console.log("Todos los talleres están completos.");
    const validInputsList = inputs.map(input => ({
      nombre: input.value,
      descripcion: input.descripcion,
      competencias: input.competencias.map(c => c.id),
      momento: listMomentos.indexOf(input.momento) + 1,
      microcredencial: input.microcredencial || null,
      sesiones: input.sesiones.map(sesion => ({
        fecha_id: sesion.fecha_id,
        hora_inicio: sesion.modalidad === "Sin Sesión" ? "00:00" : sesion.hora_inicio,
        duracion: sesion.modalidad === "Sin Sesión" ? 0 : sesion.duracion,
        modalidad: listModalidades.indexOf(sesion.modalidad) + 1,
        ubicacion: sesion.modalidad === "Sin Sesión" ? "Sin ubicación" : sesion.ubicacion
      })),
      ponentes: input.ponentes.map(ponente => ({ nombre: ponente.value }))
    }));

    data.fechas = validDatesList;
    data.talleres = validInputsList;
    data.inscripcion = false;
    data.horas = Number(data.horas);
    data.cupos = Number(data.cupos);
    console.log("Final data to send:", data);

    addEvento({
      params: data,
      tipo: "jornadas"
    });

    console.log("Formulario enviado");
  };

  /**
   * PARA LOS INPUTS DINÁMICOS
   */
  const [inputs, setInputs] = useState([
    {
      id: 1,
      hasAddButton: true,
      hasRemoveButton: false,
      sesiones: [],
      ponentes: [{ id: 1, value: "", hasAddButton: true, hasRemoveButton: false, }],
      value: "",
      descripcion: "",
      competencias: [],
      momento: "",
      microcredencial: "",
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

  const handleDescriptionChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, descripcion: newValue, isEmpty: false };
        }
        return input;
      })
    );
  };

  const handleCompetenciaChange = (id, items) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, competencias: items, isEmpty: false };
        }
        return input;
      })
    );
  };

  const handleMomentoChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, momento: newValue, isEmpty: false };
        }
        return input;
      })
    );
  };

  const handleMicrocredencialChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, microcredencial: newValue };
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
      sesiones: dates.map((date, index) => ({
        fecha_id: date.format("YYYY-MM-DD"),  // Asume que las fechas son objetos moment o similar
        hora_inicio: "",
        duracion: "",
        modalidad: index === 0 ? "Presencial" : "Sin Sesión",
        ubicacion: "",
      })),
      ponentes: [{ id: 1, value: "", hasAddButton: true, hasRemoveButton: false, }],
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

  const handleDateSwap = (tallerId, oldFechaId, newFechaId) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        const oldSesion = input.sesiones.find(s => s.fecha_id === oldFechaId);
        const newSesion = input.sesiones.find(s => s.fecha_id === newFechaId);

        if (oldSesion && newSesion) {
          const updatedNewSesion = {
            ...newSesion,
            modalidad: oldSesion.modalidad,
            hora_inicio: oldSesion.hora_inicio,
            duracion: oldSesion.duracion,
            ubicacion: oldSesion.ubicacion
          };

          const updatedOldSesion = {
            ...oldSesion,
            modalidad: "Sin Sesión",
            hora_inicio: "",
            duracion: "",
            ubicacion: ""
          };

          return {
            ...input,
            sesiones: input.sesiones.map(s => {
              if (s.fecha_id === oldFechaId) return updatedOldSesion;
              if (s.fecha_id === newFechaId) return updatedNewSesion;
              return s;
            })
          };
        }
      }
      return input;
    }));
  };

  const handleAddSession = (tallerId) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        const inactiveIndex = input.sesiones.findIndex(s => s.modalidad === "Sin Sesión" || s.modalidad === "");
        if (inactiveIndex !== -1) {
          const newSesiones = [...input.sesiones];
          newSesiones[inactiveIndex] = {
            ...newSesiones[inactiveIndex],
            modalidad: "Presencial"
          };
          return { ...input, sesiones: newSesiones };
        }
      }
      return input;
    }));
  };

  const handleRemoveSession = (tallerId, fechaId) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        return {
          ...input,
          sesiones: input.sesiones.map(s => {
            if (s.fecha_id === fechaId) {
              return {
                ...s,
                modalidad: "Sin Sesión",
                hora_inicio: "",
                duracion: "",
                ubicacion: ""
              };
            }
            return s;
          })
        };
      }
      return input;
    }));
  };

  const handleAddPonente = (tallerId) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        const newPonenteId = input.ponentes[input.ponentes.length - 1].id + 1;
        const newPonentes = input.ponentes.map(ponente => ({ ...ponente, hasAddButton: false, hasRemoveButton: false }));
        newPonentes.push({
          id: newPonenteId,
          value: "",
          hasAddButton: true,
          hasRemoveButton: true,
        });
        return { ...input, ponentes: newPonentes };
      }
      return input;
    }));
  };

  const handleRemovePonente = (tallerId, ponenteId) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        let newPonentes = input.ponentes.filter(ponente => ponente.id !== ponenteId);
        if (newPonentes.length > 1) {
          newPonentes[newPonentes.length - 1].hasAddButton = true;
          newPonentes[newPonentes.length - 1].hasRemoveButton = true;
        } else if (newPonentes.length === 1) {
          newPonentes[0].hasAddButton = true;
          newPonentes[0].hasRemoveButton = false; // No mostrar botón de eliminar si hay solo un ponente
        }
        return { ...input, ponentes: newPonentes };
      }
      return input;
    }));
  };

  const handleModalidadChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        return {
          ...input,
          sesiones: input.sesiones.map((sesion, index) =>
            index === sesionIndex ? { ...sesion, modalidad: newValue } : sesion
          )
        };
      }
      return input;
    }));
  };

  const handleHoraInicioChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        return {
          ...input,
          sesiones: input.sesiones.map((sesion, index) =>
            index === sesionIndex ? { ...sesion, hora_inicio: newValue } : sesion
          )
        };
      }
      return input;
    }));
  };

  const handleDuracionChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        return {
          ...input,
          sesiones: input.sesiones.map((sesion, index) =>
            index === sesionIndex ? { ...sesion, duracion: newValue } : sesion
          )
        };
      }
      return input;
    }));
  };

  const handleUbicacionChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        return {
          ...input,
          sesiones: input.sesiones.map((sesion, index) =>
            index === sesionIndex ? { ...sesion, ubicacion: newValue } : sesion
          )
        };
      }
      return input;
    }));
  };


  const handlePonenteChange = (tallerId, ponenteId, newValue) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        const updatedPonentes = input.ponentes.map(ponente => {
          if (ponente.id === ponenteId) {
            return { ...ponente, value: newValue };
          }
          return ponente;
        });
        return { ...input, ponentes: updatedPonentes, isEmpty: false };
      }
      return input;
    }));
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
    const newDatesFormatted = value.map(d => d.format("YYYY-MM-DD"));
    const oldDatesFormatted = dates.map(d => d.format("YYYY-MM-DD"));

    const removedDates = oldDatesFormatted.filter(d => !newDatesFormatted.includes(d));

    if (removedDates.length > 0) {
      let hasConflict = false;
      for (const input of inputs) {
        for (const sesion of input.sesiones) {
          if (sesion.modalidad !== "Sin Sesión" && removedDates.includes(sesion.fecha_id)) {
            hasConflict = true;
            break;
          }
        }
        if (hasConflict) break;
      }

      if (hasConflict) {
        triggerNotification(dispatch, {
          message: "No puedes eliminar una fecha que tiene un taller asignado.",
          type: "error"
        });
        return;
      }
    }

    // Actualizar la lista de fechas
    setDates(value);
    setValidDate(value.length > 0);

    // Actualizar las sesiones en cada taller para alinearlas con las nuevas fechas
    setInputs(inputs => inputs.map(taller => ({
      ...taller,
      sesiones: synchronizeSessions(taller.sesiones, value),
    })));
  }

  function synchronizeSessions(existingSessions, newDates) {
    // Crear un mapa de las fechas existentes para acceso rápido
    const existingDates = new Set(existingSessions.map(sesion => sesion.fecha_id));

    // Añadir nuevas sesiones para fechas nuevas
    const sessionsToAdd = newDates.filter(date => !existingDates.has(date.format('YYYY-MM-DD')))
      .map(date => ({
        fecha_id: date.format('YYYY-MM-DD'),
        hora_inicio: '',
        duracion: '',
        modalidad: 'Sin Sesión',
        ubicacion: '',
      }));

    // Filtrar las sesiones que ya no coinciden con ninguna fecha seleccionada
    const updatedSessions = existingSessions.filter(session =>
      newDates.some(date => date.format('YYYY-MM-DD') === session.fecha_id)
    );

    return [...updatedSessions, ...sessionsToAdd];
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
  const listModalidades = ["Presencial", "Virtual", "Sin Sesión"];
  const listMomentos = ["Explorador", "Integrador", "Innovador"];

  const { data: competenciasList = [] } = useGetCompetenciasQuery();


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
          <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
            <FormLabel value={"Nombre"} />
            <input
              //value="Jornada de Innovación Test"
              type="text"
              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
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
                format="YYYY-MM-DD"
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

          {/**Talleres */}

          {dates.length > 0 && <div className="flex flex-col col-span-12 gap-1">
            <FormLabel value={"Talleres"} />
            <div className="flex flex-col gap-3">
              {inputs.map((input) => (
                <>
                  <div key={input.id} className="flex flex-row justify-between items-center">
                    <div className="bg-white rounded-lg p-3 border-[1px] flex-grow">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-primary_text_1">
                            Nombre del Taller
                          </label>
                          <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-primary_text_1">
                            Descripción del Taller
                          </label>
                          <textarea
                            value={input.descripcion}
                            onChange={(e) => handleDescriptionChange(input.id, e.target.value)}
                            maxLength={250}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5 h-32"
                          />
                        </div>
                        <div className="flex flex-wrap gap-3">

                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Competencias</label>
                            <MultiSelectComboBox
                              items={competenciasList}
                              selectedItems={input.competencias}
                              onSelectionChange={(items) => handleCompetenciaChange(input.id, items)}
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Momento</label>
                            <ComboBox items={listMomentos} onSelect={(value) => handleMomentoChange(input.id, value)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-primary_text_1">Microcredencial (Opcional)</label>
                          <input
                            type="text"
                            maxLength={100}
                            placeholder="Microcredencial"
                            value={input.microcredencial}
                            onChange={(e) => handleMicrocredencialChange(input.id, e.target.value)}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                          />
                        </div>

                        {(() => {
                          const activeSesiones = input.sesiones.filter(s => s.modalidad !== "Sin Sesión");
                          const inactiveSesiones = input.sesiones.filter(s => s.modalidad === "Sin Sesión");

                          return (
                            <div className="flex flex-col gap-4 w-full">
                              {activeSesiones.map((sesion, activeIndex) => {
                                const originalIndex = input.sesiones.findIndex(s => s.fecha_id === sesion.fecha_id);
                                const availableDates = [sesion.fecha_id, ...inactiveSesiones.map(s => s.fecha_id)].sort();

                                return (
                                  <div key={sesion.fecha_id} className="flex flex-col gap-3 p-4 bg-primary_gray_1 rounded-lg border border-gray-200 relative">
                                    {activeSesiones.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSession(input.id, sesion.fecha_id)}
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
                                        items={availableDates}
                                        onSelect={(value) => { if (value !== sesion.fecha_id) handleDateSwap(input.id, sesion.fecha_id, value); }}
                                        selected={sesion.fecha_id}
                                      />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                      <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                        <label className="text-sm font-medium text-primary_text_1">Modalidad</label>
                                        <ComboBox
                                          items={listModalidades}
                                          onSelect={(value) => handleModalidadChange(input.id, originalIndex, value)}
                                          selected={sesion.modalidad}
                                        />
                                      </div>
                                      <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                        <label className="text-sm font-medium text-primary_text_1">Hora</label>
                                        <input type="time"
                                          value={sesion.hora_inicio}
                                          onChange={(e) => handleHoraInicioChange(input.id, originalIndex, e.target.value)}
                                          className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5" />
                                      </div>
                                      <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                        <label className="text-sm font-medium text-primary_text_1">Duración</label>
                                        <input type="number"
                                          value={sesion.duracion}
                                          onChange={(e) => handleDuracionChange(input.id, originalIndex, e.target.value)}
                                          className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5" />
                                      </div>
                                      <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                        <label className="text-sm font-medium text-primary_text_1">Ubicación</label>
                                        <input type="text"
                                          value={sesion.ubicacion}
                                          onChange={(e) => handleUbicacionChange(input.id, originalIndex, e.target.value)}
                                          className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-white outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5" />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                              {inactiveSesiones.length > 0 && (
                                <div className="flex justify-start">
                                  <button
                                    type="button"
                                    onClick={() => handleAddSession(input.id)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>Agregar Fecha</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {input.ponentes.map(ponente => (
                          <div key={ponente.id} className="flex items-center gap-2 w-full">
                            <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                              <label className="text-sm font-medium text-primary_text_1">
                                Ponente {ponente.id}
                              </label>
                              <input
                                type="text"
                                value={ponente.value}
                                onChange={(e) => handlePonenteChange(input.id, ponente.id, e.target.value)}
                                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm flex-grow bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                                placeholder=""
                              />
                            </div>

                            <div className="flex gap-2">
                              {ponente.hasAddButton && (
                                <Button
                                  type="ucuenca"
                                  onClick={() => handleAddPonente(input.id)}
                                  icon="add"
                                  buttonType="button"
                                  size="xsmall"
                                  isRadial={true}
                                  isPrimary={false}
                                />
                              )}
                              {ponente.hasRemoveButton && (
                                <Button
                                  type="error"
                                  onClick={() => handleRemovePonente(input.id, ponente.id)}
                                  icon="delete"
                                  buttonType="button"
                                  size="xsmall"
                                  isRadial={true}
                                  isPrimary={false}
                                />
                              )}
                            </div>
                          </div>
                        ))}
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
                      Complete todos los campos del Taller
                    </span>
                  )}
                </>
              ))}
            </div>
          </div>}


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
