import React, { useState, useEffect } from "react";
import {
  MdAdd,
  MdDelete,
  MdOutlineEdit,
  MdSave,
  MdClose,
} from "react-icons/md";
import { useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import { Oval } from "react-loader-spinner";
import { Notification, Modal, Button } from "@components";
import { Link, useNavigate } from "react-router-dom";

import { useEditCapacitacionMutation } from "@redux/services/evento/eventoApi";
import {
  useEditTallerMutation,
  useDeleteTallerMutation,
} from "@redux/services/taller/tallerApi";

import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

const EditarJornadaInnovacion = (props) => {
  /**
   * PROPS
   */
  const {
    nombre,
    nombre_tutor,
    fechas,
    horas,
    isPresencial,
    direccion,
    cupo,
    talleres,
    allow_asistencia,
    allow_inscripcion,
    id_capacitacion,
    handleRefetch,
  } = props;

  /**
   * REDUX
   */
  const dispatch = useDispatch();

  const [
    editCapacitacion,
    { data: response, isLoading: isUpdating, isSuccess, isError, error }, // This is the destructured mutation result
  ] = useEditCapacitacionMutation();

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
    //console.log(data);
    let areValidDates;
    let validDatesList = [];
    let validInputsList = [];

    //console.log(dates);
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
      data.horas = Number(data.horas);
      data.cupo = Number(data.cupo);
      //data.tipo = "Jornada";
      //console.log(data);
      console.log("Se enviará el formulario");
      setFormData({
        id: id_capacitacion,
        body: data,
      });
      setModalOpen(true);
    } else {
      console.log("No se puede enviar el formulario");
    }
  };

  /**
   * PARA LOS INPUTS DINÁMICOS
   */

  let allTalleresList = [];

  talleres.forEach((taller, index) => {
    allTalleresList.push({
      id_taller: taller.id_taller,
      id: index + 1,
      value: taller.nombre,
      isEmpty: false,
      isEnabled: false,
      enableEdit: false,
      index: index,
      originalValue: taller.nombre,
    });
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
    console.log("cancelando");
    console.log(index);
    setInputs(
      inputs.map((input) => {
        if (input.index === index) {
          return { ...input, enableEdit: false, value: input.originalValue };
        }
        return input;
      })
    );
  };

  /**
   * PARA EDITAR EL TALLER
   */
  const handleSaveEdit = (index) => {
    //console.log("guardando");
    //console.log(index);
    setInputs(
      inputs.map((input) => {
        if (input.index === index) {
          const dataBody = {
            id: input.id_taller,
            body: { nombre: input.value },
          };
          //console.log(dataBody);
          editTaller(dataBody);
          //console.log("editado");
          return { ...input, enableEdit: false };
        }
        return input;
      })
    );
  };

  useEffect(() => {
    if (isSuccessTaller) {
      console.log(responseTaller);
      triggerNotification(dispatch, {
        message: responseTaller.respuesta,
        type: "success",
      });
      handleRefetch();
      //navigate(-1);
    } else if (isErrorTaller && errorTaller) {
      console.log(errorTaller);
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
    console.log(dataBody);
    setModalOpen(false);
    deleteTaller(dataBody);
  };

  useEffect(() => {
    if (isSuccessDeleteTaller) {
      console.log(responseDeleteTaller);
      triggerNotification(dispatch, {
        message: responseDeleteTaller.respuesta,
        type: "success",
      });
      handleRefetch();
      //navigate(-1);
    } else if (isErrorDeleteTaller && errorDeleteTaller) {
      console.log(errorDeleteTaller);
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
    const parts = fecha.split("-");
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
  let selectedModalidadProp;
  if (isPresencial) {
    selectedModalidadProp = "Presencial";
  } else {
    selectedModalidadProp = "Virtual";
  }
  const [selectedModalidad, setSelectedModalidad] = useState(
    selectedModalidadProp
  );
  const handleSelect = (value) => {
    setSelectedModalidad(value);
  };

  /**
   * PARA ENVIAR EL FORMULARIO
   */
  const handleConfirmEditCapacitacion = () => {
    //console.log("Se enviará el formulario xxxx");
    //console.log(formData);
    editCapacitacion(formData);
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
    <>
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
          <div className="px-10 py-8 rounded-lg grid grid-cols-12 gap-6 w-[600px]  bg-white">
            {/**Nombre */}
            <div className="col-span-12 flex flex-col">
              <span className="text-base font-medium text-primary_color_1">
                Nombre
              </span>
              <input
                type="text"
                className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
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

            {/**Tutor */}
            <div className="col-span-5 flex flex-col">
              <span className="text-base font-medium text-primary_color_1 ">
                Tutor
              </span>
              <div className="w-full">
                <input
                  type="text"
                  defaultValue={nombre_tutor}
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
            <div className="col-span-2 flex flex-col">
              <span className="text-base font-medium text-primary_color_1 ">
                Horas
              </span>
              <div className="w-full">
                <input
                  type="number"
                  defaultValue={horas}
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
                <ComboBox
                  items={listModalidades}
                  onSelect={handleSelect}
                  hasBeenSelected={true}
                  selected={selectedModalidad}
                />
              </div>
            </div>

            {/**Dirección */}
            <div className="col-span-5 flex flex-col">
              <span className="text-base font-medium text-primary_color_1 ">
                Dirección
              </span>
              <div className="w-full">
                <input
                  type="text"
                  defaultValue={direccion}
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
                  defaultValue={cupo}
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

            {/**Talleres */}
            <div className="flex flex-col col-span-12">
              <span className="text-base font-medium text-primary_color_1">
                Talleres <span className="text-base">({talleres.length})</span>
              </span>
              <div className="flex flex-col gap-3 mt-2">
                {inputs.map((input, index) => (
                  <div key={input.id} className="flex gap-4">
                    <div className="flex flex-col w-full bg-white rounded-lg p-3 gap-1 border-[1px]">
                      <span className="text-sm font-medium text-primary_color_1">
                        Nombre del Taller
                      </span>
                      <input
                        type="text"
                        value={input.value}
                        onChange={(e) =>
                          handleInputChange(input.id, e.target.value)
                        }
                        className="font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-2 focus:ring-inset focus:ring-primary_color_1"
                        placeholder={`Taller ${input.id}`}
                        disabled={!input.enableEdit}
                        //{...register(`taller_${input.id}`, { required: true })}
                      />
                      {input.isEmpty && (
                        <span className="text-red-600 text-sm font-light px-1">
                          Ingrese un nombre válido
                        </span>
                      )}

                      {!input.enableEdit ? (
                        <div className="flex mt-2 gap-2">
                          <Button
                            type="info"
                            onClick={() => handleEnableEdit(index)}
                            icon={"edit"}
                            buttonType={"button"}
                            value={"Editar"}
                            size={"medium"}
                            isPrimary={false}
                          />
                          <Button
                            type="error"
                            onClick={() => handleDeleteTaller(input.id_taller)}
                            icon={"delete"}
                            buttonType={"button"}
                            value={"Eliminar"}
                            size={"medium"}
                            isPrimary={false}
                          />
                        </div>
                      ) : (
                        <div className="flex mt-2 gap-2">
                          <Button
                            value="Cancelar"
                            type="gray"
                            size="medium"
                            icon="close"
                            isPrimary={false}
                            buttonType={"button"}
                            onClick={() => handleCancelEdit(index)}
                          />

                          <Button
                            value="Guardar"
                            type="success"
                            size="medium"
                            icon="check"
                            isPrimary={true}
                            buttonType={"button"}
                            onClick={() => handleSaveEdit(index)}
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
                icon={"saveEdit"}
                buttonType={"submit"}
                value={"Guardar"}
                size={"medium"}
                isLoading={isUpdating}
                isPrimary={true}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarJornadaInnovacion;
