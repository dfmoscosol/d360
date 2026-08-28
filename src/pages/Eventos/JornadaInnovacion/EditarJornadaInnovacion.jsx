import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import MultiSelectComboBox from "../ui/components/MultiSelectComboBox/MultiSelectComboBox";
import { useGetCompetenciasQuery } from "@redux/services/competencia/competenciaApi";
import { Link, useNavigate } from "react-router-dom";
import { ContainerPage, InfoPill } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";
import FormLabel from "../ui/components/FormLabel/FormLabel";
import { Modal, Button } from "@components";
import { useEditEventoMutation } from "@redux/services/evento/eventoApi";
import {
  useEditTallerMutation, useAddTallerMutation,
  useDeleteTallerMutation,
} from "@redux/services/taller/tallerApi";

import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { data } from "autoprefixer";

const EditarJornadaInnovacion = (props) => {
  /**
   * PROPS
   */
  const {
    nombre,
    fechas,
    horas,
    cupos,
    talleres,
    id,
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

  const [
    addTaller,
    {
      data: responseAddTaller,
      isLoading: isUpdatingAddTaller,
      isSuccess: isSuccessAddTaller,
      isError: isErrorAddTaller,
      error: errorAddTaller,
    },
  ] = useAddTallerMutation();

  const [
    editTaller,
    {
      data: responseTaller,
      isLoading: isUpdatingTaller,
      isSuccess: isSuccessTaller,
      isError: isErrorTaller,
      error: errorTaller,
    },
  ] = useEditTallerMutation();

  const [
    deleteTaller,
    {
      data: responseDeleteTaller,
      isLoading: isUpdatingDeleteTaller,
      isSuccess: isSuccessDeleteTaller,
      isError: isErrorDeleteTaller,
      error: errorDeleteTaller,
    },
  ] = useDeleteTallerMutation();

  /**
   * PARA EL FORMULARIO
   */
  const [isValidDate, setValidDate] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const horasTotales = Number(watch("horas") || horas || 0);

  // PARA GUARDAR LA DATA DEL FORMULARIO
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    let areValidDates;
    let validDatesList = [];
    console.log(dates.length)

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
        validDatesList.push(date.format("YYYY-MM-DD"));
      });
    }
    if (areValidDates) {
      data.fechas = validDatesList;
      data.horas = Number(data.horas);
      data.cupos = Number(data.cupos);
      data.nombre = data.nombre;
      console.log(data);
      console.log("Se enviará el formulario");
      setFormData({
        id: id,
        body: data,
        tipo: "jornadas"
      });
      setModalOpen(true);
    }

  };

  /**
   * PARA LOS INPUTS DINÁMICOS
   */

  let allTalleresList = [];

  talleres.forEach((taller, indexTaller) => {
    const nuevoTaller = {
      id_taller: taller.id,
      id: indexTaller + 1,
      value: taller.nombre,
      descripcion: taller.descripcion,
      competencias: Array.isArray(taller.competencias) ? taller.competencias : [],
      momento: taller.momento,
      microcredencial: taller.microcredencial,
      cupos_extra: taller.cupos_extra,
      isEmpty: false,
      isEnabled: false,
      enableEdit: false,
      index: indexTaller,
      sesiones: taller.sesiones,
      ponentes: [],
      isNew: false
    };

    // Asignar un ID incremental a cada ponente
    if (taller.ponentes && taller.ponentes.length > 0) {
      taller.ponentes.forEach((ponente, index) => {
        nuevoTaller.ponentes.push({
          nombre: ponente.nombre,
          id: index + 1
        });
      });

    }
    // Agregar el taller procesado a la lista de talleres
    nuevoTaller.originalValue = {
      value: nuevoTaller.value,
      descripcion: nuevoTaller.descripcion,
      competencias: nuevoTaller.competencias,
      momento: nuevoTaller.momento,
      microcredencial: nuevoTaller.microcredencial,
      cupos_extra: nuevoTaller.cupos_extra,
      sesiones: nuevoTaller.sesiones,
      ponentes: nuevoTaller.ponentes.map(ponente => ({
        nombre: ponente.nombre,
        id: ponente.id
      }))
    };
    allTalleresList.push(nuevoTaller);
  });

  const [inputs, setInputs] = useState(allTalleresList);

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

  const handleCuposExtraChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, cupos_extra: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }

  const handleDescriptionChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, descripcion: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }
  const handleCompetenciaChange = (id, items) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          const newItems = items.map(item => {
            const existing = input.competencias.find(c => c.id === item.id);
            return existing ? existing : { ...item, horas: 0 };
          });
          return { ...input, competencias: newItems, isEmpty: false };
        }
        return input;
      })
    );
  }

  const handleCompetenciaHorasChange = (tallerId, compId, value) => {
    const intValue = value.replace(/[^0-9]/g, '');
    setInputs(
      inputs.map((input) => {
        if (input.id === tallerId) {
          const updatedCompetencias = input.competencias.map(c => 
            c.id === compId ? { ...c, horas: Number(intValue) } : c
          );
          return { ...input, competencias: updatedCompetencias };
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
  }

  const handleMicrocredencialChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, microcredencial: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }

  const handleAddInput = () => {
    const newInputs = [...inputs];
    console.log(dates)
    newInputs.push({
      value: "",
      descripcion: "",
      competencias: [],
      momento: "",
      microcredencial: "",
      cupos_extra: "",
      isEmpty: false,
      enableEdit: true,
      isNew: true,
      sesiones: fechas.map((fecha, index) => ({
        fecha_id: fecha.id,  // Asume que las fechas son objetos moment o similar
        fecha: fecha.fecha,
        hora_inicio: "",
        duracion: "",
        modalidad: index === 0 ? "Presencial" : "Sin Sesión",
        ubicacion: "",
      })),
      ponentes: [{ id: 1, nombre: "", hasAddButton: true, hasRemoveButton: false, }]
    });
    setInputs(newInputs);
  };

  const handleRemoveInput = () => {
    const newInputs = [...inputs];
    newInputs.pop();
    setInputs(newInputs);
  };

  const handleDateSwap = (tallerId, oldFechaStr, newFechaStr) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        const oldSesion = input.sesiones.find(s => s.fecha === oldFechaStr);
        const newSesion = input.sesiones.find(s => s.fecha === newFechaStr);

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
              if (s.fecha === oldFechaStr) return updatedOldSesion;
              if (s.fecha === newFechaStr) return updatedNewSesion;
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

  const handleRemoveSession = (tallerId, fechaStr) => {
    setInputs(inputs => inputs.map(input => {
      if (input.id === tallerId) {
        return {
          ...input,
          sesiones: input.sesiones.map(s => {
            if (s.fecha === fechaStr) {
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

  const handleModalidadChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        const updatedSesiones = input.sesiones.map((sesion, index) => {
          if (index === sesionIndex) {
            if (newValue === "Sin Sesión") {
              return {
                ...sesion,
                modalidad: newValue,
                hora_inicio: "",
                duracion: "",
                ubicacion: "",
              };
            } else {
              return {
                ...sesion,
                modalidad: newValue,
              };
            }
          }
          return sesion;
        });
        return { ...input, sesiones: updatedSesiones, isEmpty: false };
      }
      return input;
    }));
  };

  const handleHoraInicioChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        // Actualiza la hora_inicio de la sesión específica
        const updatedSesiones = input.sesiones.map((sesion, index) => {
          if (index === sesionIndex) {
            return { ...sesion, hora_inicio: newValue };
          }
          return sesion;
        });
        return { ...input, sesiones: updatedSesiones, isEmpty: false };
      }
      return input;
    }));
  };

  const handleDuracionChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        // Actualiza la duracion de la sesión específica
        const updatedSesiones = input.sesiones.map((sesion, index) => {
          if (index === sesionIndex) {
            return { ...sesion, duracion: newValue };
          }
          return sesion;
        });
        return { ...input, sesiones: updatedSesiones, isEmpty: false };
      }
      return input;
    }));
  };


  const handleUbicacionChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        // Actualiza la ubicacion de la sesión específica
        const updatedSesiones = input.sesiones.map((sesion, index) => {
          if (index === sesionIndex) {
            return { ...sesion, ubicacion: newValue };
          }
          return sesion;
        });
        return { ...input, sesiones: updatedSesiones, isEmpty: false };
      }
      return input;
    }));
  };


  const handleAddPonente = (tallerIndex) => {
    /* console.log("antes",inputs[tallerIndex].originalValuePonentes.map((ponente) => (
      {
        nombre: ponente.nombre,
        id: ponente.id
      }
    ))) */
    const newInputs = [...inputs];
    const ponentes = newInputs[tallerIndex].ponentes || [];
    ponentes.push({ id: ponentes.length + 1, nombre: '', isNew: true });
    newInputs[tallerIndex].ponentes = ponentes;
    setInputs(newInputs);

  };

  const handleRemovePonente = (tallerIndex, ponenteIndex) => {

    const newInputs = [...inputs];
    newInputs[tallerIndex].ponentes.splice(ponenteIndex, 1);
    setInputs(newInputs);
  };

  const handlePonenteChange = (tallerIndex, ponenteIndex, newName) => {
    const newInputs = [...inputs];
    newInputs[tallerIndex].ponentes[ponenteIndex].nombre = newName;
    newInputs[tallerIndex].isEmpty = false;
    setInputs(newInputs);
  };

  /**
   * Para manejar el edit
   */
  const handleEnableEdit = (index) => {
    setInputs(
      inputs.map((input) => {
        if (input.index === index) {
          return { ...input, enableEdit: true };
        }
        return input;
      })
    );
  };

  /**
   * Para el boton de cancelar
   */
  const handleCancelEdit = (index) => {
    setInputs(
      inputs.map((input) => {
        if (input.index === index) {
          return {
            ...input, enableEdit: false,
            value: input.originalValue.value,
            descripcion: input.originalValue.descripcion,
            competencia: input.originalValue.competencia,
            competencias: input.originalValue.competencias || [],
            momento: input.originalValue.momento,
            cupos_extra: input.originalValue.cupos_extra,
            sesiones: input.originalValue.sesiones,
            ponentes: input.originalValue.ponentes
              .filter(ponente => ponente.isNew !== true)
              .map(ponente => ({
                nombre: ponente.nombre,
                id: ponente.id
              }))
          };
        }
        return input;
      })
    );
  };

  /**
   * PARA EDITAR EL TALLER
   */
  const handleNewTaller = (index) => {
    console.log(inputs[index])
    const areAllInputsFilled = (inputs[index].value.trim() !== "")
      && (inputs[index].descripcion.trim() !== "")
      && (inputs[index].cupos_extra.trim() !== "")
      && (inputs[index].competencias.length > 0)
      && (inputs[index].competencias.reduce((sum, c) => sum + Number(c.horas || 0), 0) === horasTotales)
      && (!inputs[index].competencias.some(c => Number(c.horas || 0) <= 0))
      && (inputs[index].momento.trim() !== "")
      && inputs[index].sesiones.every(sesion =>
        sesion.fecha_id &&
        sesion.modalidad.trim() !== "" &&
        (sesion.modalidad === "Sin Sesión" ||
          (sesion.hora_inicio.trim() !== "" &&
            sesion.duracion.trim() !== "" &&
            sesion.ubicacion.trim() !== ""))
      )
      && inputs[index].ponentes.every(ponente => ponente.nombre.trim() !== "");
    console.log(areAllInputsFilled)
    if (areAllInputsFilled) {
      let input = inputs[index]
      const dataBody = {
        id_evento: id,
        body: {
          nombre: input.value,
          descripcion: input.descripcion,
          competencias: input.competencias.map(c => ({ id: c.id, horas: Number(c.horas || 0) })),
          momento: listMomentos.indexOf(input.momento) + 1,
          microcredencial: input.microcredencial || null,
          cupos_extra: Number(input.cupos_extra),
          sesiones: input.sesiones.map(({ ...sesion }) => ({
            ...sesion,
            hora_inicio: sesion.modalidad === "Sin Sesión" ? "00:00" : sesion.hora_inicio,
            duracion: sesion.modalidad === "Sin Sesión" ? 0 : sesion.duracion,
            ubicacion: sesion.modalidad === "Sin Sesión" ? "N/A" : sesion.ubicacion,
            modalidad: listModalidades.indexOf(sesion.modalidad) + 1
          })),
          ponentes: input.ponentes.map((ponente) => ({ "nombre": ponente.nombre }))
        },
      };
      console.log(dataBody);
      addTaller(dataBody);
    } else {
      setInputs(inputs.map((input, idx) => {
        if (idx === index) {
          return { ...input, isEmpty: true };
        }
        return input;
      }));
    }
    //console.log("editado");
  }

  const handleSaveEdit = (index) => {
    //console.log("guardando");
    setInputs(
      inputs.map((input) => {
        if (input.index === index) {
          const dataBody = {
            id: input.id_taller,
            id_evento: id,
            body: {
              nombre: input.value,
              descripcion: input.descripcion,
              competencias: input.competencias.map(c => ({ id: c.id, horas: Number(c.horas || 0) })),
              momento: listMomentos.indexOf(input.momento) + 1,
              microcredencial: input.microcredencial || null,
              cupos_extra: Number(input.cupos_extra),
              sesiones: input.sesiones.map(({ fecha, fecha_id, ...sesion }) => ({
                id: sesion.id,
                hora_inicio: sesion.modalidad === "Sin Sesión" ? "00:00" : sesion.hora_inicio,
                duracion: sesion.modalidad === "Sin Sesión" ? 0 : sesion.duracion,
                modalidad: listModalidades.indexOf(sesion.modalidad) + 1,
                ubicacion: sesion.modalidad === "Sin Sesión" ? "N/A" : sesion.ubicacion
              })),
              ponentes: input.ponentes.map((ponente) => ({ nombre: ponente.nombre }))
            },
          };
          editTaller(dataBody);
          console.log("editado", dataBody);
          return { ...input, enableEdit: false };
        }
        return input;
      })
    );
  };

  useEffect(() => {
    if (isSuccessAddTaller) {
      triggerNotification(dispatch, {
        message: "Nuevo taller guardado exitosamente.",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorAddTaller && errorAddTaller) {
      triggerNotification(dispatch, {
        message: error.data.error || "Error al crear el taller.",
        type: "error",
      });
    }
  }, [isSuccessAddTaller, isErrorAddTaller, errorAddTaller, dispatch]);

  useEffect(() => {
    if (isSuccessTaller) {
      triggerNotification(dispatch, {
        message: "Cambios en el taller guardados exitosamente.",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorTaller && errorTaller) {
      triggerNotification(dispatch, {
        message: error.data.error || "Error al editar el taller.",
        type: "error",
      });
    }
  }, [isSuccessTaller, isErrorTaller, errorTaller, dispatch]);

  /**
   * Para borrar el taller
   */
  const [isModalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [idTallerToDelete, setIdTallerToDelete] = useState(null);

  const handleDeleteTaller = (id) => {
    setIdTallerToDelete(id);
    setModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    const dataBody = {
      id: idTallerToDelete,
    };
    setModalOpen(false);
    deleteTaller(dataBody);
  };

  useEffect(() => {
    if (isSuccessDeleteTaller) {
      triggerNotification(dispatch, {
        message: responseDeleteTaller.respuesta,
        type: "success",
      });
      handleRefetch();
      //navigate(-1);
    } else if (isErrorDeleteTaller && errorDeleteTaller) {
      triggerNotification(dispatch, {
        message: errorDeleteTaller.data.error || "Error al borrar el taller.",
        type: "error",
      });
    }
  }, [isSuccessDeleteTaller, isErrorDeleteTaller, errorDeleteTaller, dispatch]);

  /**
   * PARA EL DATE PICKER
   */
  const fechasDateFormat = [];
  fechas.forEach((fecha, index) => {
    const parts = fecha.fecha.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    fechasDateFormat.push(new DateObject(new Date(year, month, day)));
  });
  const [dates, setDates] = useState(fechasDateFormat);
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
          if (sesion.modalidad !== "Sin Sesión" && removedDates.includes(sesion.fecha)) {
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

    setDates(value);
    if (value.length > 0) {
      setValidDate(true);
    } else {
      setValidDate(false);
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
          className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
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
   * PARA ENVIAR EL FORMULARIO
   */
  const handleConfirmeditEvento = () => {
    //console.log("Se enviará el formulario xxxx");
    console.log(formData);
    editEvento(formData);
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
      handleRefetch();
      navigate(-1);
    } else if (isError && error) {
      console.log(error);
      triggerNotification(dispatch, {
        message: error.data.error || "Error al editar la capacitación.",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

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
            onClick={handleConfirmeditEvento}
            isLoading={isUpdating}
          />
        )}
      </Modal>
      <div className="flex justify-center rounded-lg pb-10">
        <Modal
          isOpen={isModalDeleteOpen}
          message="¿Desea eliminar este taller?"
          onClose={() => setModalDeleteOpen(false)}
          type={"error"}
          title={"Eliminar Taller"}
          showCancel={!isSuccessDeleteTaller}
        >
          {isSuccessDeleteTaller ? (
            <Link to="/eventos">
              <Button
                value="Eliminación exitosa"
                type="success"
                size="medium"
                icon="check"
                isPrimary={true}
              />
            </Link>
          ) : (
            <Button
              value="Eliminar"
              type="error"
              size="medium"
              icon="delete"
              isPrimary={true}
              onClick={handleConfirmDelete}
              isLoading={isUpdatingDeleteTaller}
            />
          )}
        </Modal>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ContainerForm>
            {(() => {
              const isAnyTallerInvalid = inputs.some(input => {
                if (input.competencias.length === 0) return true;
                const suma = input.competencias.reduce((sum, c) => sum + Number(c.horas || 0), 0);
                const hasZero = input.competencias.some(c => Number(c.horas || 0) <= 0);
                return suma !== horasTotales || hasZero;
              });
              
              return (
                <>
                  {/**Nombre */}
            <div className="col-span-12 flex flex-col gap-1">
              <FormLabel value={"Nombre"} />
              <input
                type="text"
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                placeholder="Jornada 1"
                defaultValue={nombre}
                {...register("nombre", { required: true })}
              />
              {errors.nombre && (
                <span className="text-red-600 text-sm font-light px-1">
                  Ingrese un nombre válido.
                </span>
              )}
            </div>

            {/**Fecha**/}
            <div className="col-span-8 flex flex-col gap-1">
              <FormLabel value={"Fechas"} />
              <div className="w-full flex flex-col">
                <DatePicker
                  multiple
                  //plugins={[<DatePanel />]}
                  weekStartDayIndex={1}
                  showOtherDays={true}
                  //minDate={today}
                  weekDays={weekDays}
                  months={months}
                  onChange={handleDateChange}
                  style={{
                    width: "100%",
                  }}
                  value={dates}
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
            <div className="col-span-2 flex flex-col gap-1">
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
            <div className="col-span-2 flex flex-col gap-1">
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
                icon={"saveEdit"}
                buttonType={"submit"}
                value={"Guardar"}
                size={"medium"}
                isLoading={isUpdating}
                isDisabled={isAnyTallerInvalid || horasTotales === 0}
                isPrimary={true}
              />
            </div>

            {/**Talleres */}
            <div className="flex flex-col col-span-12 gap-1">
              <div className="flex items-center justify-start gap-4">
                <FormLabel value={`Talleres (${inputs.length})`} />
                <Button
                  type="ucuenca"
                  onClick={handleAddInput}
                  icon="add"
                  buttonType="button"
                  value="Atrás"
                  size="small"
                  isRadial={true}
                  isPrimary={false}
                />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {inputs.map((input, index) => (
                  <div key={input.id} className="flex gap-4">
                    <div className="flex flex-col w-full bg-white rounded-lg p-3 gap-1 border-[1px]">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-primary_text_1">
                          Nombre del Taller
                        </label>
                        <input
                          type="text"
                          value={input.value}
                          onChange={(e) =>
                            handleInputChange(input.id, e.target.value)
                          }
                          className={` ${input.enableEdit
                            ? "bg-white outline-none ring-1 ring-inset ring-primary_gray_5"
                            : "bg-primary_gray_1"
                            } text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full`}
                          disabled={!input.enableEdit}
                        />
                      </div>
                      <div className="flex flex-col mt-1">
                        <label className="text-sm font-medium text-primary_text_1">
                          Descripción del Taller
                        </label>
                        <textarea
                          value={input.descripcion}
                          onChange={(e) => handleDescriptionChange(input.id, e.target.value)}
                          maxLength={400}
                          className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5 h-32 text-justify"
                          disabled={!input.enableEdit}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-primary_text_1">
                          Cupos Extra
                        </label>
                        <input
                          type="number"
                          value={input.cupos_extra}
                          onChange={(e) =>
                            handleCuposExtraChange(input.id, e.target.value)
                          }
                          className={` ${input.enableEdit
                            ? "bg-white outline-none ring-1 ring-inset ring-primary_gray_5"
                            : "bg-primary_gray_1"
                            } text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full`}
                          disabled={!input.enableEdit}
                        />
                      </div>
                      <div className="flex flex-wrap pt-1 gap-3">
                        <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)] w-full">
                          <label className="text-sm font-medium text-primary_text_1">Competencias</label>
                          <MultiSelectComboBox
                            items={competenciasList}
                            selectedItems={input.competencias}
                            onSelectionChange={(items) => handleCompetenciaChange(input.id, items)}
                            isEnabled={input.enableEdit}
                          />
                          {input.competencias.length > 0 && (() => {
                            const sumaHoras = input.competencias.reduce((sum, c) => sum + Number(c.horas || 0), 0);
                            const hasInvalidHoras = input.competencias.some(c => Number(c.horas || 0) <= 0);
                            const isTotalValid = sumaHoras === horasTotales && !hasInvalidHoras && horasTotales > 0;
                            
                            return (
                              <div className="mt-2 flex flex-col gap-2 p-3 bg-primary_gray_1 rounded-lg w-full">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-primary_text_1">Asignar horas</span>
                                  <span className={`text-sm font-bold ${isTotalValid ? 'text-green-600' : 'text-red-600'}`}>
                                    Total: {sumaHoras} / {horasTotales} hrs
                                  </span>
                                </div>
                                {input.competencias.map(comp => (
                                  <div key={comp.id} className="flex justify-between items-center gap-2">
                                    <span className="text-sm text-primary_text_1">{comp.nombre}</span>
                                    <div className="flex items-center gap-1">
                                      <input 
                                        type="number" 
                                        value={comp.horas === 0 && input.enableEdit ? '' : comp.horas} 
                                        onChange={(e) => handleCompetenciaHorasChange(input.id, comp.id, e.target.value)}
                                        onKeyDown={(e) => {
                                          if (['.', ',', '-', 'e', 'E'].includes(e.key)) {
                                            e.preventDefault();
                                          }
                                        }}
                                        className={`w-20 focus:bg-white text-primary_gray_4 p-1 rounded text-sm outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5 ${input.enableEdit ? 'bg-white' : 'bg-primary_gray_1'}`}
                                        min={0} max={horasTotales || 100}
                                        step={1}
                                        disabled={!input.enableEdit}
                                      />
                                      <span className="text-sm text-primary_gray_4">hrs</span>
                                    </div>
                                  </div>
                                ))}
                                {input.enableEdit && hasInvalidHoras && (
                                  <span className="text-red-600 text-xs mt-1 font-light">Asigne un valor mayor a 0 a todas las competencias.</span>
                                )}
                                {input.enableEdit && !isTotalValid && !hasInvalidHoras && horasTotales > 0 && (
                                  <span className="text-red-600 text-xs mt-1 font-light">Llevas {sumaHoras} de {horasTotales} horas asignadas. La suma debe ser exacta.</span>
                                )}
                                {input.enableEdit && horasTotales === 0 && (
                                  <span className="text-red-600 text-xs mt-1 font-light">Primero debe ingresar las Horas totales de la jornada.</span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                          <label className="text-sm font-medium text-primary_text_1">Momento</label>
                          <ComboBox items={listMomentos} onSelect={(value) => handleMomentoChange(input.id, value)}
                            selected={input.momento} enableEdit={input.enableEdit} isEnabled={input.enableEdit} />
                        </div>
                      </div>
                      <div className="flex flex-col pt-3">
                        <label className="text-sm font-medium text-primary_text_1">Microcredencial (Opcional)</label>
                        <input
                          type="text"
                          maxLength={100}
                          placeholder="Microcredencial"
                          value={input.microcredencial || ""}
                          onChange={(e) => handleMicrocredencialChange(input.id, e.target.value)}
                          className={` ${input.enableEdit
                            ? "bg-white outline-none ring-1 ring-inset ring-primary_gray_5"
                            : "bg-primary_gray_1"
                            } text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full`}
                          disabled={!input.enableEdit}
                        />
                      </div>

                      {(() => {
                        const activeSesiones = input.sesiones.filter(s => s.modalidad !== "Sin Sesión");
                        const inactiveSesiones = input.sesiones.filter(s => s.modalidad === "Sin Sesión");

                        return (
                          <div className="flex flex-col gap-4 w-full pt-3">
                            {activeSesiones.map((sesion, activeIndex) => {
                              const originalIndex = input.sesiones.findIndex(s => s.fecha === sesion.fecha);
                              const availableDates = [sesion.fecha, ...inactiveSesiones.map(s => s.fecha)].sort();

                              return (
                                <div key={sesion.fecha} className="flex flex-col gap-3 p-4 bg-primary_gray_1 rounded-lg border border-gray-200 relative">
                                  {input.enableEdit && activeSesiones.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSession(input.id, sesion.fecha)}
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
                                      onSelect={(value) => { if (value !== sesion.fecha) handleDateSwap(input.id, sesion.fecha, value); }}
                                      selected={sesion.fecha}
                                      enableEdit={input.enableEdit}
                                      isEnabled={input.enableEdit}
                                    />
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                      <label className="text-sm font-medium text-primary_text_1">Modalidad</label>
                                      <ComboBox
                                        items={listModalidades}
                                        onSelect={(value) => handleModalidadChange(input.id, originalIndex, value)}
                                        selected={sesion.modalidad}
                                        enableEdit={input.enableEdit}
                                        isEnabled={input.enableEdit}
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                      <label className="text-sm font-medium text-primary_text_1">Hora</label>
                                      <input type="time"
                                        disabled={!input.enableEdit}
                                        value={sesion.hora_inicio}
                                        onChange={(e) => handleHoraInicioChange(input.id, originalIndex, e.target.value)}
                                        className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit
                                          ? "bg-white outline-none ring-1 ring-inset ring-primary_gray_5"
                                          : "bg-primary_gray_1"
                                          }`} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                      <label className="text-sm font-medium text-primary_text_1">Duración</label>
                                      <input type="number"
                                        disabled={!input.enableEdit}
                                        value={sesion.duracion}
                                        onChange={(e) => handleDuracionChange(input.id, originalIndex, e.target.value)}
                                        className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit
                                          ? "bg-white outline-none ring-1 ring-inset ring-primary_gray_5"
                                          : "bg-primary_gray_1"
                                          }`} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                                      <label className="text-sm font-medium text-primary_text_1">Ubicación</label>
                                      <input type="text"
                                        disabled={!input.enableEdit}
                                        value={sesion.ubicacion}
                                        onChange={(e) => handleUbicacionChange(input.id, originalIndex, e.target.value)}
                                        className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit
                                          ? "bg-white outline-none ring-1 ring-inset ring-primary_gray_5"
                                          : "bg-primary_gray_1"
                                          }`} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {input.enableEdit && inactiveSesiones.length > 0 && (
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

                      <div className="flex items-center justify-start pt-2 gap-3">
                        <label className="text-sm font-medium text-primary_text_1">Ponentes</label>
                        {input.enableEdit && (
                          <Button
                            onClick={() => handleAddPonente(index)}
                            icon="add"
                            buttonType="button"
                            type="ucuenca"
                            size="xsmall"
                            isRadial={true}
                            isPrimary={false}
                          />
                        )}
                      </div>
                      {input.ponentes.map((ponente, ponenteIndex) => (
                        <div key={ponente.id} className="flex gap-2 pt-2 items-center">
                          <input
                            type="text"
                            value={ponente.nombre}
                            onChange={(e) => handlePonenteChange(index, ponenteIndex, e.target.value)}
                            className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit ? "outline-none ring-1 ring-inset ring-primary_gray_5" : "bg-primary_gray_1"}`}
                            disabled={!input.enableEdit}
                          />
                          {/* button was accidentally placed here */}
                          {input.enableEdit && (
                            <Button
                              type="error"
                              onClick={() => handleRemovePonente(index, ponenteIndex)}
                              icon="delete"
                              buttonType="button"
                              size="xsmall"
                              isRadial={true}
                              isPrimary={false}
                            />
                          )}
                        </div>
                      ))}


                      {input.isEmpty && (
                        <span className="text-red-600 text-sm font-light px-1">
                          Complete todos los campos del Taller
                        </span>
                      )}

                      {!input.enableEdit ? (
                        <div className="flex mt-2 gap-2">
                          <Button
                            type="ucuenca"
                            onClick={() => handleEnableEdit(index)}
                            icon={"edit"}
                            buttonType={"button"}
                            value={"Editar"}
                            size={"small"}
                            isPrimary={false}
                          />
                          <Button
                            type="error"
                            onClick={() => handleDeleteTaller(input.id_taller)}
                            icon={"delete"}
                            buttonType={"button"}
                            value={"Eliminar"}
                            size={"small"}
                            isPrimary={false}
                          />
                        </div>
                      ) : (
                        <div className="flex mt-2 gap-2">
                          <Button
                            value="Cancelar"
                            type="gray"
                            size="small"
                            icon="close"
                            isPrimary={false}
                            buttonType={"button"}
                            onClick={() => input.isNew ? handleRemoveInput() : handleCancelEdit(index)}
                          />

                          {(() => {
                            const sumaHoras = input.competencias.reduce((sum, c) => sum + Number(c.horas || 0), 0);
                            const isHorasInvalid = sumaHoras !== horasTotales || input.competencias.some(c => Number(c.horas || 0) <= 0);
                            return (
                              <Button
                                value="Guardar"
                                type="ucuenca"
                                size="small"
                                icon="check"
                                isPrimary={true}
                                buttonType={"button"}
                                onClick={() => input.isNew ? handleNewTaller(index) : handleSaveEdit(index)}
                                isLoading={isUpdatingTaller}
                                isDisabled={isHorasInvalid}
                              />
                            );
                          })()}
                        </div>
                      )}
                    </div>

                  </div>

                ))}

              </div>
            </div>

            {/**Footer */}
            <div className="col-span-12 text-primary_gray_5">
              <hr />
            </div>
          </>
          );
          })()}
          </ContainerForm>
        </form>
      </div>
    </ContainerPage>
  );
};

export default EditarJornadaInnovacion;
