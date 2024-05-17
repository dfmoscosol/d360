import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "@components";
import { useActualizarInscripcionMutation } from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import PillPorInscribir from "../PillPorInscribir/PillPorInscribir";
import { useEliminarInscripcionMutation } from "@redux/services/evento/eventoApi";

import EventoView, {
  Header,
  Title,
  Info,
  Data,
  Footer,
  TitlePanel,
  Activator,
  SubTitle,
  TogglePanel,
  SectionContainer,
} from "../EventoView/EventoView";

const AprobationSection = (props) => {
  /**
   * PROPS
   */
  const { docentesPendientes, handleRefetch } = props;

  /**
   * REDUX
   */
  const dispatch = useDispatch();

  /**
   * PARA APROBAR LA INSCRIPCION
   */
  const [
    actualizarInscripcion,
    {
      data: responseAprobar,
      isLoading: isUpdatingAprobar,
      isSuccess: isSuccessAprobar,
      isError: isErrorAprobar,
      error: errorAprobar,
    },
  ] = useActualizarInscripcionMutation();

  const [idDocenteAprobacion, setIdDocenteAprobacion] = useState();

  const handleAprobarInscripcion = (id) => {
    setIdDocenteAprobacion(id);
    console.log(id)
    setModalOpen(true);
  };

  const handleConfirmarAprobacion = () => {
    console.log("confirmar aprobación");
    console.log(idDocenteAprobacion);
    const paramsConfirm = {
      id: idDocenteAprobacion,
      body: { aceptada: true },
    };
    console.log(paramsConfirm);
    actualizarInscripcion(paramsConfirm);
  };

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessAprobar) {
      console.log(responseAprobar);
      triggerNotification(dispatch, {
        message: "Inscripción aprobada exitosamente",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorAprobar && errorAprobar) {
      console.log(errorAprobar);
      triggerNotification(dispatch, {
        message: errorAprobar.message || "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccessAprobar, isErrorAprobar, errorAprobar, dispatch]);

  /**
   * PARA ELIMINAR LA INSCRIPCION
   */
  const [
    eliminarInscripcion,
    {
      data: responseEliminar,
      isLoading: isUpdatingEliminar,
      isSuccess: isSuccessEliminar,
      isError: isErrorEliminar,
      error: errorEliminar,
    },
  ] = useEliminarInscripcionMutation();

  const handleEliminarInscripcion = (id) => {
    console.log("denegar inscripción");
    console.log(id);
    const paramsConfirm = {
      id: id,
    };
    console.log(paramsConfirm);
    eliminarInscripcion(paramsConfirm);
  };

  useEffect(() => {
    if (isSuccessEliminar) {
      console.log(responseEliminar);
      triggerNotification(dispatch, {
        message: "Inscripción denegada.",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorEliminar && errorEliminar) {
      console.log(errorEliminar);
      triggerNotification(dispatch, {
        message: errorEliminar.message || "Error al aprobar la inscripción",
        type: "error",
      });
    }
  }, [isSuccessEliminar, isErrorEliminar, errorEliminar, dispatch]);

  /**
   * PARA EL MODAL
   */
  const [isModalOpen, setModalOpen] = useState(false);

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
            value="Eliminación exitosa"
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
            onClick={() => handleConfirmarAprobacion()}
            isLoading={isUpdatingAprobar}
          />
        )}
      </Modal>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        title="Aprobar"
        subTitle="Docentes pendientes de aprobación"
        hasIcon={false}
      />
      <SectionContainer extra={"gap-4"}>
        {docentesPendientes.length > 0 ? (
          <div className="flex flex-col gap-4">
            
            {docentesPendientes.map((docente, index) => (
              
              <PillPorInscribir
                index={index}
                title={docente.nombres}
                subTitle={docente.correo}
                key={index}
              >
                <div className="flex gap-2">
                  <Button
                    value="Aceptar"
                    type="success"
                    size="small"
                    icon="check"
                    isPrimary={true}
                    setModalOpen
                    onClick={() =>
                      handleAprobarInscripcion(docente.id_inscripcion)
                    }
                  />
                  <Button
                    value="Denegar"
                    type="error"
                    size="small"
                    icon="close"
                    isPrimary={false}
                    onClick={() =>
                      handleEliminarInscripcion(docente.id_inscripcion)
                    }
                    isLoading={isUpdatingEliminar}
                  />
                </div>
              </PillPorInscribir>
            ))}
          </div>
        ) : (
          <span className="text-sm font-medium text-primary_gray_4">
            Ningún docente pendiente por aprobación.
          </span>
        )}
      </SectionContainer>
    </EventoView>
  );
};

export default AprobationSection;
