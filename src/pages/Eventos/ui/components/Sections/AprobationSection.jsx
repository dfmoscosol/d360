import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "@components";
import { useActualizarInscripcionMutation, useEliminarInscripcionMutation, useGetAllObservadoresQuery } from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import PillPorInscribir from "../PillPorInscribir/PillPorInscribir";
import ComboBox from "../ComboBox/ComboBox";
import { MdOutlinePersonSearch } from "react-icons/md";
import EventoView, { Header, SectionContainer } from "../EventoView/EventoView";

const AprobationSection = (props) => {
  const { docentesPendientes, observacion, handleRefetch } = props;
  const dispatch = useDispatch();
  const { data, refetch: refetchGetAllObservadores } = useGetAllObservadoresQuery();

  const [
    actualizarInscripcion,
    { isSuccess: isSuccessAprobar, isError: isErrorAprobar, error: errorAprobar },
  ] = useActualizarInscripcionMutation();

  const [
    eliminarInscripcion,
    { isSuccess: isSuccessEliminar, isError: isErrorEliminar, error: errorEliminar },
  ] = useEliminarInscripcionMutation();

  const observadores = data && data.respuesta.map((observador) => observador.nombre);
  const [idDocenteAprobacion, setIdDocenteAprobacion] = useState();
  const [idObservadorAprobacion, setIdObservadorAprobacion] = useState();
  const [observadoresSelected, setObservadoresSelected] = useState([]);
  const [errorObservador, setErrorObservador] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEliminarModalOpen, setEliminarModalOpen] = useState(false);

  useEffect(() => {
    setObservadoresSelected([]);
  }, [docentesPendientes]); // Asegurarse de limpiar el estado al cambiar docentesPendientes

  const handleAprobarInscripcion = (id, indexObservador) => {
    setIdDocenteAprobacion(id);
    if (observacion) {
      const observador = data && data.respuesta.find((obs) => obs.nombre === observadoresSelected[indexObservador]);
      if (observador) {
        setIdObservadorAprobacion(observador.id);
      } else {
        setErrorObservador(true);
        return;
      }
    }
    setModalOpen(true);
  };

  const handleSelect = (value, index) => {
    setErrorObservador(false);
    setObservadoresSelected((prevState) => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  const handleConfirmarAprobacion = () => {
    const paramsConfirm = {
      id: idDocenteAprobacion,
      body: { aceptada: true, ...(observacion && { observador_id: idObservadorAprobacion }) },
    };
    actualizarInscripcion(paramsConfirm);
  };

  const handleAprobarEliminacion = (id) => {
    setIdDocenteAprobacion(id);
    setEliminarModalOpen(true);
  };

  const handleEliminarInscripcion = () => {
    eliminarInscripcion({ id: idDocenteAprobacion });
    setEliminarModalOpen(false);
  };

  useEffect(() => {
    if (isSuccessAprobar) {
      triggerNotification(dispatch, {
        message: "Inscripción aprobada exitosamente",
        type: "success",
      });
      setErrorObservador(false);
      handleRefetch();
    } else if (isErrorAprobar && errorAprobar) {
      triggerNotification(dispatch, {
        message: errorAprobar.data.error || "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccessAprobar, isErrorAprobar, errorAprobar, dispatch, handleRefetch]);

  useEffect(() => {
    if (isSuccessEliminar) {
      triggerNotification(dispatch, {
        message: "Inscripción eliminada.",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorEliminar && errorEliminar) {
      triggerNotification(dispatch, {
        message: errorEliminar.data.error || "Error al eliminar la inscripción",
        type: "error",
      });
    }
  }, [isSuccessEliminar, isErrorEliminar, errorEliminar, dispatch, handleRefetch]);

  return (
    <EventoView>
      <Modal
        isOpen={isModalOpen}
        message="¿Desea aprobar esta inscripción?"
        onClose={() => setModalOpen(false)}
        type={"success"}
        title={"Aprobar inscripción"}
        showCancel={!isSuccessAprobar}
      >
        {isSuccessAprobar ? (
          <Button
            value="Aprobación exitosa"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
          />
        ) : (
          <Button
            value="Confirmar"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={handleConfirmarAprobacion}
          />
        )}
      </Modal>
      <Modal
        isOpen={isEliminarModalOpen}
        message="¿Desea eliminar esta inscripción?"
        onClose={() => setEliminarModalOpen(false)}
        type={"error"}
        title={"Eliminar inscripción"}
        showCancel={!isSuccessEliminar}
      >
        {isSuccessEliminar ? (
          <Button
            value="Eliminación exitosa"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
          />
        ) : (
          <Button
            value="Confirmar"
            type="error"
            size="medium"
            icon="delete"
            isPrimary={true}
            onClick={handleEliminarInscripcion}
          />
        )}
      </Modal>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        title="Aprobar"
        subTitle="Docentes pendientes de aprobación"
      />
      <SectionContainer extra={"gap-4"}>
        {docentesPendientes.length > 0 ? (
          <div className="flex flex-col gap-4">
            {docentesPendientes.map((docente, index) => (
              <PillPorInscribir
                key={index}
                index={index}
                title={docente.nombre}
                subTitle={docente.correo}
                data={docente.encuesta ? docente.encuesta : []}
              >
                {docente.encuesta && (
                  <div className="flex flex-col col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <MdOutlinePersonSearch size={20} className="text-primary_gray_4" />
                      <span className="text-sm font-medium text-primary_text_1">Asignar Observador:</span>
                    </div>
                    <div className="pt-2 w-full">
                      <ComboBox items={observadores} indexGeneral={index} onSelect={handleSelect} />
                    </div>
                    {errorObservador && (
                      <span className="text-red-600 text-sm font-light px-1">Seleccione una opción</span>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    value="Aceptar"
                    type="success"
                    size="small"
                    icon="check"
                    isPrimary={true}
                    onClick={() => handleAprobarInscripcion(docente.id_inscripcion, index)}
                  />
                  <Button
                    value="Denegar"
                    type="error"
                    size="small"
                    icon="close"
                    isPrimary={false}
                    onClick={() => handleAprobarEliminacion(docente.id_inscripcion)}
                  />
                </div>
              </PillPorInscribir>
            ))}
          </div>
        ) : (
          <span className="text-sm font-medium text-primary_gray_4">Ningún docente pendiente por aprobación.</span>
        )}
      </SectionContainer>
    </EventoView>
  );
};

export default AprobationSection;
