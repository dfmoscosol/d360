import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "@components";
import { useActualizarInscripcionMutation } from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import PillPorInscribir from "../PillPorInscribir/PillPorInscribir";
import { useEliminarInscripcionMutation } from "@redux/services/evento/eventoApi";
import { useGetAllObservadoresQuery } from "@redux/services/evento/eventoApi";
import ComboBox from "../ComboBox/ComboBox";
import { MdOutlinePersonSearch } from "react-icons/md";

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
  const { docentesPendientes, observacion, handleRefetch } = props;

  /**
   * REDUX
   */
  const dispatch = useDispatch();

  /**
   * PARA APROBAR LA INSCRIPCION
   */

  const {
    data,
    refetch: refetchGetAllObservadores,
    error,
    isLoading,
    isFetching,
    isError,
  } = useGetAllObservadoresQuery();

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

  const observadores = data && data.respuesta.map((observador) => observador.nombre)

  const [idDocenteAprobacion, setIdDocenteAprobacion] = useState();
  const [idObservadorAprobacion, setIdObservadorAprobacion] = useState();
  const [observadoresSelected, setObservadoresSelected] = useState([]);
  const [errorObservador, setErrorObservador] = useState(false);

  const handleAprobarInscripcion = (id, indexObservador) => {

    setIdDocenteAprobacion(id);

    if (observacion) {
      const observador = data && data.respuesta.find((obs) => obs.nombre === observadoresSelected[indexObservador]);
      if (observador) {
        setIdObservadorAprobacion(observador.id)
      } else {
        setErrorObservador(true)
        return
      }
      console.log(id, observacion, observador.id)
    }
    setModalOpen(true);
  };

  const handleSelect = (value, index) => {
    console.log(index, value)
    setErrorObservador(false)
    setObservadoresSelected(prevState => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  const handleConfirmarAprobacion = () => {
    console.log("confirmar aprobación");
    console.log(idDocenteAprobacion);
    const paramsConfirm = {
      id: idDocenteAprobacion,
      body: { aceptada: true, ...(observacion && { observador_id: idObservadorAprobacion }) },
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
      setErrorObservador(false)
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
        message: "Inscripción eliminada.",
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
                title={docente.nombre}
                subTitle={docente.correo}
                key={index}
                data={docente.encuesta ? docente.encuesta : []}
              >
                {docente.encuesta && <div className="flex flex-col col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <MdOutlinePersonSearch size={20} className="text-primary_gray_4" />
                    <span className="text-sm font-medium text-primary_text_1">Asignar Observador:</span>
                  </div>
                  <div className="pt-2 w-full">
                    <ComboBox items={observadores} indexGeneral={index} onSelect={handleSelect} />
                  </div>
                  {errorObservador && (
                    <span className="text-red-600 text-sm font-light px-1">
                      Seleccione una opción
                    </span>
                  )}
                </div>}
                <div className="flex justify-end gap-2">
                  <Button
                    value="Aceptar"
                    type="success"
                    size="small"
                    icon="check"
                    isPrimary={true}
                    setModalOpen
                    onClick={() =>
                      handleAprobarInscripcion(docente.id_inscripcion, index)
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
