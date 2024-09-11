import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import ComboBox from "../ui/components/ComboBox/ComboBox";
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
    formState: { errors },
  } = useForm();

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
        validDatesList.push(date.format("DD-MM-YYYY"));
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
      competencia: taller.competencia,
      momento: taller.momento,
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
      competencia: nuevoTaller.competencia,
      momento: nuevoTaller.momento,
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
  const handleCompetenciaChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, competencia: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }
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

  const handleAddInput = () => {
    const newInputs = [...inputs];
    console.log(dates)
    newInputs.push({
      value: "",
      descripcion: "",
      competencia: "",
      momento: "",
      cupos_extra: "",
      isEmpty: false,
      enableEdit: true,
      isNew: true,
      sesiones: fechas.map(fecha => ({
        fecha_id: fecha.id,  // Asume que las fechas son objetos moment o similar
        fecha: fecha.fecha,
        hora_inicio: "",
        duracion: "",
        modalidad: "",
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

  const handleModalidadChange = (tallerId, sesionIndex, newValue) => {
    setInputs(inputs.map(input => {
      if (input.id === tallerId) {
        // Actualiza la modalidad de la sesión específica
        const updatedSesiones = input.sesiones.map((sesion, index) => {
          if (index === sesionIndex) {
            return { ...sesion, modalidad: newValue };
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
      && (inputs[index].competencia.trim() !== "")
      && (inputs[index].momento.trim() !== "")
      && inputs[index].sesiones.every(sesion =>
        sesion.fecha_id &&
        sesion.hora_inicio.trim() !== "" &&
        sesion.duracion.trim() !== "" &&
        sesion.modalidad.trim() !== "" &&
        sesion.ubicacion.trim() !== "")
      && inputs[index].ponentes.every(ponente => ponente.nombre.trim() !== "");
    console.log(areAllInputsFilled)
    if (areAllInputsFilled) {
      let input = inputs[index]
      const dataBody = {
        id_evento: id,
        body: {
          nombre: input.value,
          descripcion: input.descripcion,
          competencia: listCompetencias.indexOf(input.competencia) + 1,
          momento: listMomentos.indexOf(input.momento) + 1,
          cupos_extra: Number(input.cupos_extra),
          sesiones: input.sesiones.map(({ ...sesion }) => ({
            ...sesion,
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
              competencia: listCompetencias.indexOf(input.competencia) + 1,
              momento: listMomentos.indexOf(input.momento) + 1,
              cupos_extra: Number(input.cupos_extra),
              sesiones: input.sesiones.map(({ fecha, fecha_id, ...sesion }) => ({
                ...sesion,
                modalidad: listModalidades.indexOf(sesion.modalidad) + 1
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
    const formattedDate = `${parts[1]}-${parts[0]}-${parts[2]}`;
    fechasDateFormat.push(new DateObject(new Date(formattedDate)));
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

  const listModalidades = ["Presencial", "Virtual"];
  const listCompetencias = ["Tecnológica", "Pedagógica", "Comunicativa", "De Gestión", "Investigativa"];
  const listMomentos = ["Explorador", "Integrador", "Innovador"];



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
                        <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                          <label className="text-sm font-medium text-primary_text_1">Competencia</label>
                          <ComboBox items={listCompetencias} onSelect={(value) => handleCompetenciaChange(input.id, value)}
                            selected={input.competencia} enableEdit={input.enableEdit} isEnabled={input.enableEdit} />
                        </div>
                        <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                          <label className="text-sm font-medium text-primary_text_1">Momento</label>
                          <ComboBox items={listMomentos} onSelect={(value) => handleMomentoChange(input.id, value)}
                            selected={input.momento} enableEdit={input.enableEdit} isEnabled={input.enableEdit} />
                        </div>
                      </div>

                      {input.sesiones.map((sesion, index) => (<>
                        <div className="flex flex-col items-start justify-start pt-3">
                          <InfoPill
                            value={sesion.fecha}
                            size="small"
                            type="date"
                            icon="date"
                          />
                        </div>
                        <div className="flex flex-wrap pt-1 gap-3">
                          {/* Hora, Duración, Modalidad, Ubicación */}
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Hora</label>
                            <input type="time"
                              disabled={!input.enableEdit}
                              value={sesion.hora_inicio}
                              onChange={(e) => handleHoraInicioChange(input.id, index, e.target.value)}
                              className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit ? "outline-none ring-1 ring-inset ring-primary_gray_5" : "bg-primary_gray_1"}`} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Duración</label>
                            <input type="number"
                              value={sesion.duracion}
                              disabled={!input.enableEdit}
                              onChange={(e) => handleDuracionChange(input.id, index, e.target.value)}
                              className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit ? "outline-none ring-1 ring-inset ring-primary_gray_5" : "bg-primary_gray_1"}`} placeholder="Duración en horas" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Modalidad</label>
                            <ComboBox items={listModalidades} onSelect={(value) => handleModalidadChange(input.id, index, value)}
                              selected={sesion.modalidad} enableEdit={input.enableEdit} isEnabled={input.enableEdit} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-[calc(50%-0.75rem)]">
                            <label className="text-sm font-medium text-primary_text_1">Ubicación</label>
                            <input type="text"
                              value={sesion.ubicacion}
                              disabled={!input.enableEdit}
                              onChange={(e) => handleUbicacionChange(input.id, index, e.target.value)}
                              className={`focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${input.enableEdit ? "outline-none ring-1 ring-inset ring-primary_gray_5" : "bg-primary_gray_1"}`} placeholder="Ingrese ubicación" />
                          </div>
                        </div></>
                      ))}

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

                          <Button
                            value="Guardar"
                            type="ucuenca"
                            size="small"
                            icon="check"
                            isPrimary={true}
                            buttonType={"button"}
                            onClick={() => input.isNew ? handleNewTaller(index) : handleSaveEdit(index)}
                            isLoading={isUpdatingTaller}
                          />
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
          </ContainerForm>
        </form>
      </div>
    </ContainerPage>
  );
};

export default EditarJornadaInnovacion;
