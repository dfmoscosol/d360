import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEditCapacitacionMutation } from "@redux/services/evento/eventoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { Modal, Button } from "@components";
import { ContainerPage } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";

const EditarCharla = (props) => {
  /**
   * PROPS
   */
  const {
    cupo,
    direccion,
    fechas,
    horas,
    id_capacitacion,
    nombre,
    nombre_tutor,
    isPresencial,
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
    console.log(data);
    let areValidDates;
    let validDatesList = [];

    console.log(dates);

    if (dates === null || dates.length == 0) {
      console.log("ERROR: No se ha elegido más de una fecha.");
      setValidDate(false);
      areValidDates = false;
    } else {
      console.log("Se ha elegido más de una fecha.");
      setValidDate(true);
      areValidDates = true;
      validDatesList.push(dates.format("DD-MM-YYYY"));
    }

    let isModalidadPresencial = false;
    if (selectedModalidad === "Presencial") {
      isModalidadPresencial = true;
    }

    if (areValidDates) {
      console.log("Se puede enviar el formulario");
      data.fechas = validDatesList;
      data.presencial = isModalidadPresencial;
      data.horas = Number(data.horas);
      data.cupo = Number(data.cupo);
      console.log(data);
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
   * PARA EL DATE PICKER
   */
  const parts = fechas[0].split("-");
  const formattedDate = `${parts[1]}-${parts[0]}-${parts[2]}`;
  const [dates, setDates] = useState(new DateObject(new Date(formattedDate)));
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

  // Estado para almacenar el valor seleccionado
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
    console.log("Se enviará el formulario xxxx");
    console.log(formData);
    editCapacitacion(formData);
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
          <div className="col-span-12 flex flex-col">
            <span className="text-base font-medium text-primary_color_1">
              Nombre
            </span>
            <input
              defaultValue={nombre}
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
                //multiple
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
              icon={"saveEdit"}
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

export default EditarCharla;
