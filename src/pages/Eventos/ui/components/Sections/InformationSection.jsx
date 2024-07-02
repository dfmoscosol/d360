import React from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Modal, InfoPill, Button } from "@components";

import EventoView, {
  Header,
  Title,
  Info,
  Data,
  Activator,
  SubTitle,
  TogglePanel,
  SectionContainer,
  TalleresPanel,
  PonentesPanel,
  SesionesPanel,
  PonentesPanelMicrotalleres
} from "../EventoView/EventoView";

import {
  useEditEventoMutation,
  useDeleteEventoMutation,
} from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

const InformationSection = (props) => {
  /**
   * PROPS
   */
  const {
    headerIcon,
    headerTitle,
    headerSubTitle,
    headerLinkToNew,
    headerLinkToEdit,

    id,
    routeType,
    containerNombre,
    containerFechas,
    containerDataList,

    toggleAllowInscripcion,

    handleRefetch,
    hasTalleres,
    talleresList,
    isCharla,
    isMicrotaller,
    sesiones,
    ponentes
  } = props;

  /**
   * REDUX
   */
  const dispatch = useDispatch();
  /**
   * ROUTER
   */
  const navigate = useNavigate();

  /**
   * PARA EL MODAL
   */
  const [isModalOpen, setModalOpen] = useState(false);

  /**
   * PARA BORRAR LA CAPACITACION
   */
  const [
    deleteEvento,
    {
      data: responseDelete,
      isLoading: isUpdatingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteEventoMutation();

  const handleConfirmDeleteEvento = () => {
    const dataBody = {
      id: id,
    };
    deleteEvento(dataBody);
  };

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessDelete) {
      //console.log(responseDelete);
      triggerNotification(dispatch, {
        message: responseDelete.respuesta,
        type: "success",
      });
      navigate("/eventos");
    } else if (isErrorDelete && errorDelete) {
      triggerNotification(dispatch, {
        message: errorDelete.data.error || "Error al eliminar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, dispatch]);

  /**
   * PARA EDITAR LA CAPACITACION
   */
  const [
    editEvento,
    {
      data: responseEdit,
      isLoading: isUpdatingEdit,
      isSuccess: isSuccessEdit,
      isError: isErrorEdit,
      error: errorEdit,
    },
  ] = useEditEventoMutation();

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessEdit) {
      //console.log(responseEdit);
      triggerNotification(dispatch, {
        message: "Inscripciones al evento actualizadas",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorEdit && errorEdit) {
      triggerNotification(dispatch, {
        message: errorEdit.message || "Error al actualizar el evento",
        type: "error",
      });
    }
  }, [isSuccessEdit, isErrorEdit, errorEdit, dispatch]);

  /**
   * PARA LOS TOGGLES
   */

  const handleInscripcionTogle = (isActive) => {
    //console.log("inscripcion toggle", isActive);
    const dataBody = {
      id: id,
      tipo: routeType,
      body: { inscripcion: isActive },
    };
    editEvento(dataBody);
  };

  let toggles = [];

  if (toggleAllowInscripcion !== undefined) {
    toggles.push(
      <Activator
        isActivatorActive={toggleAllowInscripcion}
        value={"Inscripciones"}
        handleTogle={handleInscripcionTogle}
        isLoading={isUpdatingEdit}
      />
    );
  }

  return (
    <EventoView>
      <Modal
        isOpen={isModalOpen}
        message="¿Desea eliminar este evento?"
        onClose={() => setModalOpen(false)}
        type={"error"}
        title={"Eliminar Evento"}
        showCancel={!isSuccessDelete}
      >
        {isSuccessDelete ? (
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
            onClick={handleConfirmDeleteEvento}
            isLoading={isUpdatingDelete}
          />
        )}
      </Modal>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        icon={headerIcon}
        title={headerTitle}
        subTitle={headerSubTitle}
        hasIcon={false}
      >
        <div className="flex gap-2 items-center">
          <Link to={headerLinkToNew}>
            <Button
              value="Nuevo"
              type="ucuenca"
              size="medium"
              icon="add"
              extra="w-full"
              isPrimary={true}
            />
          </Link>
          <Link className="" to={headerLinkToEdit}>
            <Button
              value="Editar"
              type="ucuenca"
              size="medium"
              icon="edit"
              extra="w-full"
              isPrimary={false}
            //isRadial={true}
            />
          </Link>
          <Button
            value="Eliminar"
            type="ucuenca"
            size="medium"
            icon="delete"
            onClick={() => setModalOpen(true)}
            extra="w-full"
            isPrimary={false}
          //isRadial={true}
          />
        </div>
      </Header>
      <SectionContainer>
        <Title value={containerNombre} />
        <div className="flex flex-col gap-2">
          <Data dataList={containerDataList} />
        </div>
        {hasTalleres && (
          <>
            <SubTitle value={"Talleres"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {talleresList.map((taller, index) => (
                <TalleresPanel key={index} extra="col-span-1" taller={taller} />
              ))}
            </div>
          </>
        )}
        {isMicrotaller && (
          <>
            <SubTitle value={"Sesiones"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sesiones.map((sesion, index) => (
                <SesionesPanel key={index} extra="col-span-1" sesion={sesion} />
              ))}
            </div>
            <SubTitle value={"Ponentes"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ponentes.map((ponente, index) => (
                <PonentesPanelMicrotalleres key={index} extra="col-span-1" ponente={ponente} />
              ))}
            </div>
          </>
        )}
        {isCharla && (
          <>
            <SubTitle value={"Ponentes"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ponentes.map((ponente, index) => (
                <PonentesPanel key={index} extra="col-span-1" ponente={ponente} />
              ))}
            </div>
          </>
        )}
        <SubTitle value={"Estados"} />
        <TogglePanel toggles={toggles} />
      </SectionContainer>
    </EventoView>
  );
};

export default InformationSection;
