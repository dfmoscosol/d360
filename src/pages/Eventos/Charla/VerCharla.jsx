import React, { useState } from "react";

import {
  useEditCapacitacionMutation,
  useDeleteEventoMutation,
} from "@redux/services/evento/eventoApi";
import { Notification, Modal } from "@components";
import { Link } from "react-router-dom";

import { GrWorkshop } from "react-icons/gr";
import {
  MdLockPerson,
  MdOutlineLockOpen,
  MdDoNotTouch,
  MdOutlineEmojiPeople,
  MdDateRange,
  MdDelete,
  MdOutlineEdit,
  MdAdd,
} from "react-icons/md";

const VerCharla = (props) => {
  /**
   * Para actualizar y borrar la capacitacion
   */
  const [
    editCapacitacion,
    { data: response, isLoading: isUpdating, isSuccess, isError, error }, // This is the destructured mutation result
  ] = useEditCapacitacionMutation();

  const [
    deleteCapacitacion,
    {
      data: responseDelete,
      isLoading: isUpdatingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteEventoMutation();

  const {
    allow_asistencia,
    allow_inscripcion,
    cupo,
    direccion,
    fechas,
    horas,
    id_capacitacion,
    nombre,
    nombre_tutor,
    isPresencial,
  } = props;

  let modalidad = "";

  if (isPresencial) {
    modalidad = "Presencial";
  } else {
    modalidad = "Virtual";
  }

  const shouldShowNotification = isSuccess || isError;
  const message = isError ? error?.data.error : response?.respuesta;

  const handleCloseInscripcion = () => {
    console.log(id_capacitacion);
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: false },
    };
    console.log(dataBody);
    editCapacitacion(dataBody);
  };

  const handleOpenInscripcion = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: true },
    };
    editCapacitacion(dataBody);
  };

  const handleCloseAsistencia = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia: false },
    };
    editCapacitacion(dataBody);
  };

  const handleOpenAsistencia = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia: true },
    };
    editCapacitacion(dataBody);
  };

  /**
   * Para el modal
   */
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    const dataBody = {
      id: id_capacitacion,
    };
    console.log("confirm");
    setModalOpen(false);
    deleteCapacitacion(dataBody);
  };

  return (
    <div className="flex justify-center pb-12">
      <Modal
        isOpen={isModalOpen}
        message="¿Desea eliminar este evento?"
        onClose={() => setModalOpen(false)}
        type={"error"}
        title={"Eliminar Evento"}
      >
        <button
          className="font-medium px-4 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 active:bg-red-600 hover:text-white transition-all duration-200"
          onClick={handleConfirmDelete}
        >
          Eliminar Evento
        </button>
      </Modal>

      {shouldShowNotification && (
        <Notification message={message} isError={isError} />
      )}
      <div className="px-10 py-8 flex flex-col items-start w-[600px] bg-white rounded-lg">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {/***/}
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <GrWorkshop size={25} />
            </div>
            <span className="font-medium text-base text-primary_gray_2">
              Charla
            </span>
          </div>
          <Link to={"/eventos/nuevoEvento/charla"}>
            <div className="bg-blue-100 text-blue-600 rounded-full flex items-center p-1 hover:shadow-lg transition-all duration-200">
              <MdAdd size={25} />
            </div>
          </Link>
        </div>
        <div className="w-full pt-4">
          <hr className="border-primary_gray_5" />
        </div>
        <span className="font-medium text-3xl text-primary_color_1 py-8">
          {nombre}
        </span>

        <div className="flex gap-2">
          {allow_inscripcion ? (
            <div className="flex items-center gap-1 rounded-xl bg-green-200 text-green-700 px-3 py-2">
              <MdOutlineEmojiPeople size={20} />
              <span className="text-sm font-normal">
                Inscripciones Abiertas
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-xl bg-yellow-200 text-yellow-700 px-3 py-2">
              <MdDoNotTouch size={20} />
              <span className="text-sm font-normal">
                Inscripciones Cerradas
              </span>
            </div>
          )}
          {allow_asistencia ? (
            <div className="flex items-center gap-1 rounded-xl bg-green-200 text-green-700 px-3 py-2">
              <MdOutlineLockOpen size={20} />
              <span className="text-sm font-normal">Asistencia Habilitada</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-xl bg-yellow-200 text-yellow-700 px-3 py-2">
              <MdLockPerson size={20} />
              <span className="text-sm font-normal">
                Asistencia Deshabilitada
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 ">
          {fechas.map((fecha, index) => (
            <div
              className="flex items-center gap-1 rounded-xl bg-primary_gray_1 text-primary_gray_4 px-3 py-1 mt-2"
              key={index}
            >
              <MdDateRange size={20} />
              <span className="text-sm font-normal">{fecha}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 w-full mt-6 gap-2">
          <span className="col-span-1 text-base font-light text-primary_gray_2">
            Tutor
          </span>
          <span className="col-span-3 text-base font-medium text-primary_color_1">
            {nombre_tutor}
          </span>
          <span className="col-span-1 text-base font-light text-primary_gray_2">
            Dirección
          </span>
          <span className="col-span-3 text-base font-medium text-primary_color_1">
            {direccion}
          </span>
          <span className="col-span-1 text-base font-light text-primary_gray_2">
            Cupo
          </span>
          <span className="col-span-3 text-base font-medium text-primary_color_1">
            {cupo}
          </span>
          <span className="col-span-1 text-base font-light text-primary_gray_2">
            Horas
          </span>
          <span className="col-span-3 text-base font-medium text-primary_color_1">
            {horas}
          </span>
          <span className="col-span-1 text-base font-light text-primary_gray_2">
            Modalidad
          </span>
          <span className="col-span-3 text-base font-medium text-primary_color_1">
            {modalidad}
          </span>
        </div>

        <div className="w-full pt-8 pb-4 ">
          <hr className="border-primary_gray_5" />
        </div>
        <div className="flex gap-2 w-full justify-between">
          {allow_inscripcion ? (
            <button
              onClick={handleCloseInscripcion}
              className="w-full flex gap-1 items-center justify-center p-2 rounded-lg border border-yellow-600 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-200"
            >
              <MdDoNotTouch size={20} />
              <span className="text-sm font-medium">Inscripciones</span>
            </button>
          ) : (
            <button
              onClick={handleOpenInscripcion}
              className="w-full flex gap-1 items-center justify-center p-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
            >
              <MdOutlineEmojiPeople size={20} />
              <span className="text-sm font-medium">Inscripciones</span>
            </button>
          )}

          {allow_asistencia ? (
            <button
              onClick={handleCloseAsistencia}
              className="w-full flex gap-1 items-center justify-center p-2 rounded-lg border border-yellow-600 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-200"
            >
              <MdLockPerson size={20} />
              <span className="text-sm font-medium">Asistencia</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAsistencia}
              className="w-full flex gap-1 items-center justify-center p-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
            >
              <MdOutlineLockOpen size={20} />
              <span className="text-sm font-medium">Asistencia</span>
            </button>
          )}

          <Link to={`/eventos/editarEvento/${id_capacitacion}`}>
            <button className="w-full flex gap-1 items-center justify-center p-2 rounded-lg border border-primary_color_1 text-primary_color_1 hover:bg-primary_color_1 hover:text-white transition-all duration-200">
              <MdOutlineEdit size={20} />
              <span className="text-sm font-medium">Editar</span>
            </button>
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex gap-1 items-center justify-center p-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            <MdDelete size={20} />
            <span className="text-sm font-medium">Borrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerCharla;
