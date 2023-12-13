import React from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Modal, InfoPill, ContainerPage, Button } from "@components";
import PillInscritos from "../PillInscritos/PillInscritos";

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

import {
  useEditCapacitacionMutation,
  useDeleteEventoMutation,
  useActualizarInscripcionMutation,
} from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

import { useEliminarInscripcionMutation } from "@redux/services/evento/eventoApi";

const InscribedSection = (props) => {
  const { docentesInscritos, handleRefetch } = props;

  /**
   * REDUX
   */
  const dispatch = useDispatch();

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

  const [idDocenteAprobacion, setIdDocenteAprobacion] = useState();

  const handleAprobarEliminacion = (id) => {
    setIdDocenteAprobacion(id);
    setModalOpen(true);
  };

  const handleEliminarInscripcion = (id) => {
    console.log("denegar inscripción");
    console.log(id);
    const paramsConfirm = {
      id: idDocenteAprobacion,
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
        //isOpen={true}
        isOpen={isModalOpen}
        message="¿Desea eliminar esta inscripción?"
        onClose={() => setModalOpen(false)}
        type={"error"}
        title={"Eliminar inscripción"}
        showCancel={!isSuccessEliminar}
      >
        {isSuccessEliminar ? (
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
            onClick={handleEliminarInscripcion}
            isLoading={isUpdatingEliminar}
          />
        )}
      </Modal>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        title="Inscritos"
        subTitle="Docentes inscritos actualmente"
        hasIcon={false}
      />
      <SectionContainer>
        {docentesInscritos.length > 0 ? (
          <div className="flex flex-col gap-4">
            {docentesInscritos.map((docente, index) => (
              <PillInscritos
                index={index}
                title={docente.nombres}
                subTitle={docente.correo}
                key={index}
              >
                <Button
                  value=""
                  type="error"
                  size="small"
                  icon="delete"
                  isPrimary={true}
                  onClick={() =>
                    handleAprobarEliminacion(docente.id_inscripcion)
                  }
                  //isLoading={isUpdatingEdit}
                  isRadial={true}
                />
              </PillInscritos>
            ))}
          </div>
        ) : (
          <span className="text-sm font-medium text-primary_gray_4">
            Ningún docente inscrito actualmente.
          </span>
        )}
      </SectionContainer>
    </EventoView>
  );
};

export default InscribedSection;
