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
  Footer,
  TitlePanel,
  Activator,
  SubTitle,
  TogglePanel,
  SectionContainer,
  TalleresPanel,
} from "../EventoView/EventoView";

import {
  useEditCapacitacionMutation,
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

    idCapacitacion,

    containerNombre,
    containerFechas,
    containerDataList,

    toggleAllowEntrada,
    toggleAllowSalida,
    toggleAllowInscripcion,

    handleRefetch,
    hasTalleres,
    talleresList,
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
    deleteCapacitacion,
    {
      data: responseDelete,
      isLoading: isUpdatingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteEventoMutation();

  const handleConfirmDeleteCapacitacion = () => {
    const dataBody = {
      id: idCapacitacion,
    };
    deleteCapacitacion(dataBody);
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
    editCapacitacion,
    {
      data: responseEdit,
      isLoading: isUpdatingEdit,
      isSuccess: isSuccessEdit,
      isError: isErrorEdit,
      error: errorEdit,
    },
  ] = useEditCapacitacionMutation();

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessEdit) {
      //console.log(responseEdit);
      triggerNotification(dispatch, {
        message: "Capacitación actualizada con éxito",
        type: "success",
      });
      handleRefetch();
    } else if (isErrorEdit && errorEdit) {
      triggerNotification(dispatch, {
        message: errorEdit.message || "Error al actualizar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessEdit, isErrorEdit, errorEdit, dispatch]);

  /**
   * PARA LOS TOGGLES
   */

  // PARA LA ENTRADA
  const handleAsistenciaEntradaTogle = (isActive) => {
    console.log("asistencia entrada toggle", isActive);
    const dataBody = {
      id: idCapacitacion,
      body: { allow_asistencia_entrada: isActive },
    };
    editCapacitacion(dataBody);
  };

  const handleAsistenciaSalidaTogle = (isActive) => {
    console.log("asistencia salida toggle", isActive);
    const dataBody = {
      id: idCapacitacion,
      body: { allow_asistencia_salida: isActive },
    };
    editCapacitacion(dataBody);
  };

  const handleInscripcionTogle = (isActive) => {
    //console.log("inscripcion toggle", isActive);
    const dataBody = {
      id: idCapacitacion,
      body: { allow_inscripcion: isActive },
    };
    editCapacitacion(dataBody);
  };

  let toggles = [];

  if (toggleAllowEntrada !== undefined) {
    toggles.push(
      <Activator
        isActivatorActive={toggleAllowEntrada}
        value={"Marcar Entrada"}
        handleTogle={handleAsistenciaEntradaTogle}
        isLoading={isUpdatingEdit}
      />
    );
  }

  if (toggleAllowSalida !== undefined) {
    toggles.push(
      <Activator
        isActivatorActive={toggleAllowSalida}
        value={"Marcar Salida"}
        handleTogle={handleAsistenciaSalidaTogle}
        isLoading={isUpdatingEdit}
      />
    );
  }

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
            onClick={handleConfirmDeleteCapacitacion}
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
              type="success"
              size="medium"
              icon="add"
              extra="w-full"
              isPrimary={false}
              //isRadial={true}
            />
          </Link>
          <Link className="" to={headerLinkToEdit}>
            <Button
              value="Editar"
              type="info"
              size="medium"
              icon="edit"
              extra="w-full"
              isPrimary={false}
              //isRadial={true}
            />
          </Link>
          <Button
            value="Eliminar"
            type="error"
            size="medium"
            icon="delete"
            onClick={() => setModalOpen(true)}
            extra="w-full"
            isPrimary={true}
            //isRadial={true}
          />
        </div>
      </Header>
      <SectionContainer>
        <Title value={containerNombre} />
        <div className="flex flex-col gap-2">
          <Info>
            {containerFechas.map((fecha, index) => (
              <InfoPill
                value={fecha}
                size="medium"
                type="date"
                icon="date"
                key={index}
              />
            ))}
          </Info>
        </div>
        <Data dataList={containerDataList} />
        {hasTalleres && (
          <>
            <SubTitle value={"Talleres"} />
            <TalleresPanel talleresList={talleresList} />
          </>
        )}
        <SubTitle value={"Estados"} />
        <TogglePanel toggles={toggles} />
      </SectionContainer>
    </EventoView>
  );
};

export default InformationSection;
