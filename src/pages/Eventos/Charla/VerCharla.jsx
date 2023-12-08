import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

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
} from "../ui/components/EventoView/EventoView";

import {
  useEditCapacitacionMutation,
  useDeleteEventoMutation,
} from "@redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

import { Modal, InfoPill, ContainerPage, Button } from "@components";
import Tabs from "../ui/components/Tabs/Tabs";
import PillPorInscribir from "../ui/components/PillPorInscribir/PillPorInscribir";
import PillInscritos from "../ui/components/PillInscritos/PillInscritos";
import InscripcionesTab from "../ui/components/InscripcionesTab/InscripcionesTab";

import { Link } from "react-router-dom";
import { GrWorkshop } from "react-icons/gr";
import { MdCheckCircle } from "react-icons/md";
import {
  MdInfo,
  MdPersonAddAlt1,
  MdPersonSearch,
  MdOutlineChecklistRtl,
  MdCheckBox,
} from "react-icons/md";

const VerCharla = (props) => {
  /**
   * PROPS
   */
  const {
    allow_asistencia_entrada,
    allow_asistencia_salida,
    allow_inscripcion,
    cupo,
    direccion,
    docentesInscritos,
    docentesPendientes,
    fechas,
    horas,
    id_capacitacion,
    nombre,
    nombre_tutor,
    isPresencial,
  } = props;

  /**
   * TEST DATA
   */
  const DOCENTESTESTPORACEPTAR = [
    {
      correo: "diego.moscosol@ucuenca.edu.ec",
      docente_id: "4dphEyHljfR8g2QSPXTax9bDo0B3",
      isaccepted: true,
      nombres: "DIEGO FERNANDO MOSCOSO LOZANO",
    },
    {
      correo: "xavier.coronel@ucuenca.edu.ec",
      docente_id: "aO1Qk9x48DW0o71KZecEeehrs3N2",
      isaccepted: false,
      nombres: "Xavier Coronel",
    },
  ];

  const DOCENTESTEACEPTADOS = [
    {
      correo: "diego.moscosol@ucuenca.edu.ec",
      docente_id: "4dphEyHljfR8g2QSPXTax9bDo0B3",
      isaccepted: true,
      nombres: "DIEGO FERNANDO MOSCOSO LOZANO",
    },
    {
      correo: "xavier.coronel@ucuenca.edu.ec",
      docente_id: "aO1Qk9x48DW0o71KZecEeehrs3N2",
      isaccepted: false,
      nombres: "Xavier Coronel",
    },
  ];

  /**
   * REDUX AND STATES
   */
  const dispatch = useDispatch();
  const [paramUpdated, setParamUpdated] = useState();

  // PARA ACTUALIZAR LA CAPACITACIÓN
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

  // PARA BORRAR LA CAPACITACIÓN
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

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessEdit) {
      console.log(responseEdit);
      console.log(paramUpdated);
      if (paramUpdated.key === "allow_inscripcion") {
        setIsInscripcionTogleActive(paramUpdated.value);
      } else if (paramUpdated.key === "allow_asistencia_entrada") {
        setIsAsistenciaEntradaTogleActive(paramUpdated.value);
      } else if (paramUpdated.key === "allow_asistencia_salida") {
        setIsAsistenciaSalidaTogleActive(paramUpdated.value);
      }
      triggerNotification(dispatch, {
        message: "Capacitación actualizada con éxito",
        type: "success",
      });
    } else if (isErrorEdit && errorEdit) {
      triggerNotification(dispatch, {
        message: errorEdit.message || "Error al actualizar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessEdit, isErrorEdit, errorEdit, dispatch]);

  /**
   * MODALIDAD
   */
  let modalidad = "";
  if (isPresencial) {
    modalidad = "Presencial";
  } else {
    modalidad = "Virtual";
  }

  /**
   * TOGLES
   */
  // PARA LA ENTRADA
  const [isAsistenciaEntradaTogleActive, setIsAsistenciaEntradaTogleActive] =
    useState(allow_asistencia_entrada);

  const handleAsistenciaEntradaTogle = (isActive) => {
    //console.log("asistencia entrada toggle", isActive);
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_entrada: isActive },
    };
    setParamUpdated({ key: "allow_asistencia_entrada", value: isActive });
    editCapacitacion(dataBody);
  };

  // PARA LA SALIDA
  const [isAsistenciaSalidaTogleActive, setIsAsistenciaSalidaTogleActive] =
    useState(allow_asistencia_salida);

  const handleAsistenciaSalidaTogle = (isActive) => {
    console.log("asistencia salida toggle", isActive);
    //setIsAsistenciaSalidaTogleActive(isActive);
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_salida: isActive },
    };
    setParamUpdated({ key: "allow_asistencia_salida", value: isActive });
    editCapacitacion(dataBody);
  };

  // PARA LA INSCRIPCION
  const [isInscripcionTogleActive, setIsInscripcionTogleActive] =
    useState(allow_inscripcion);

  const handleInscripcionTogle = (isActive) => {
    console.log("inscripcion toggle", isActive);
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: isActive },
    };
    console.log(dataBody);
    setParamUpdated({ key: "allow_inscripcion", value: isActive });
    editCapacitacion(dataBody);
  };

  /**
   * PARA EL MODAL DELETE
   */
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    const dataBody = {
      id: id_capacitacion,
    };
    //console.log("confirm");
    setModalOpen(false);
    deleteCapacitacion(dataBody);
  };

  /**
   * VISTAS
   */
  const EventoSection = () => (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        icon={<GrWorkshop size={25} />}
        title="Charla"
        subTitle="Capacitación"
        hasIcon={false}
      >
        <div className="flex gap-2 items-center">
          <Link to={"/eventos/nuevoEvento/charla"}>
            <Button
              value="Nuevo"
              type="success"
              size="medium"
              icon="add"
              extra="w-full"
              //isRadial={true}
            />
          </Link>

          <Link className="" to={`/eventos/editarEvento/${id_capacitacion}`}>
            <Button
              value="Editar"
              type="info"
              size="medium"
              icon="edit"
              extra="w-full"
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
            //isRadial={true}
          />
        </div>
      </Header>
      <SectionContainer>
        <Title value={nombre} />
        <div className="flex flex-col gap-2">
          <Info>
            {fechas.map((fecha, index) => (
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
        <Data
          dataList={[
            {
              key: "Tutor",
              value: nombre_tutor,
            },
            {
              key: "Dirección",
              value: direccion,
            },
            {
              key: "Cupo",
              value: cupo,
            },
            {
              key: "Horas",
              value: horas,
            },
            {
              key: "Modalidad",
              value: modalidad,
            },
          ]}
        />
        <SubTitle value={"Activadores"} />
        <TogglePanel
          toggles={[
            <Activator
              isActivatorActive={isAsistenciaEntradaTogleActive}
              value={"Entrada"}
              handleTogle={handleAsistenciaEntradaTogle}
            />,
            <Activator
              isActivatorActive={isAsistenciaSalidaTogleActive}
              value={"Salida"}
              handleTogle={handleAsistenciaSalidaTogle}
            />,
            <Activator
              isActivatorActive={isInscripcionTogleActive}
              value={"Inscripción"}
              handleTogle={handleInscripcionTogle}
            />,
          ]}
        />
      </SectionContainer>
    </EventoView>
  );

  const AprobarSection = () => (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        //icon={<MdOutlineChecklistRtl size={25} />}
        //title={`Inscripciones por Aprobar (${DOCENTESTESTPORACEPTAR.length})`}
        title="Aprobar"
        subTitle="Docentes pendientes de aprobación"
        hasIcon={false}
      />
      <SectionContainer extra={"gap-4"}>
        {DOCENTESTESTPORACEPTAR.map((docente, index) => (
          <div>
            <PillPorInscribir
              index={index}
              title={docente.nombres}
              subTitle={docente.correo}
            >
              <div className="flex gap-2">
                <Button
                  value="Aceptar"
                  type="success"
                  size="small"
                  icon="check"
                  //onClick={handleCloseInscripcion}
                  //isLoading={isUpdatingEdit}
                />
                <Button
                  value="Denegar"
                  type="error"
                  size="small"
                  icon="close"
                  //onClick={handleCloseInscripcion}
                  //isLoading={isUpdatingEdit}
                />
              </div>
            </PillPorInscribir>
          </div>
        ))}
      </SectionContainer>
    </EventoView>
  );

  const InscritosSection = () => (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        //icon={<MdCheckBox size={25} />}
        title="Inscritos"
        subTitle="Docentes inscritos actualmente"
        hasIcon={false}
      />

      <SectionContainer extra={"gap-4"}>
        {DOCENTESTESTPORACEPTAR.map((docente, index) => (
          <PillInscritos
            index={index}
            title={docente.nombres}
            subTitle={docente.correo}
          >
            <Button
              value=""
              type="error"
              size="small"
              icon="delete"
              //onClick={handleCloseInscripcion}
              //isLoading={isUpdatingEdit}
              isRadial={true}
            />
          </PillInscritos>
        ))}
      </SectionContainer>
    </EventoView>
  );

  const InscribirSection = () => (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        //icon={<MdPersonAddAlt1 size={25} />}
        title="Inscribir"
        subTitle="Inscripción manual de docentes"
        hasIcon={false}
      />
      <SectionContainer>
        <InscripcionesTab id={id_capacitacion} />
      </SectionContainer>
    </EventoView>
  );

  return (
    <ContainerPage>
      {/**Para borrar */}
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
      <EventoView extra={"p-4 md:p-6"}>
        <Tabs
          tabList={[
            {
              title: "Información",
              icon: <GrWorkshop size={20} />,
              content: <EventoSection />,
            },
            {
              title: "Aprobar",
              icon: <MdOutlineChecklistRtl size={20} />,
              content: <AprobarSection />,
            },
            {
              title: "Inscritos",
              icon: <MdCheckBox size={20} />,
              content: <InscritosSection />,
            },
            {
              title: "Inscribir",
              icon: <MdPersonAddAlt1 size={20} />,
              content: <InscribirSection />,
            },
          ]}
          activeIndex={0}
        />
      </EventoView>
    </ContainerPage>
  );
};

export default VerCharla;

{
  /**
        <Info>
          {isInscripcionOpen ? (
            <InfoPill
              value="Inscripciones"
              size="medium"
              type="success"
              icon="inscripciones"
            />
          ) : (
            <InfoPill
              value="Inscripciones"
              size="medium"
              type="warning"
              icon="close"
            />
          )}
          {isAsistenciaEntradaOpen ? (
            <InfoPill
              value="Entrada"
              size="medium"
              type="success"
              icon="entrada"
            />
          ) : (
            <InfoPill
              value="Entrada"
              size="medium"
              type="warning"
              icon="close"
            />
          )}
          {isAsistenciaSalidaOpen ? (
            <InfoPill
              value="Salida"
              size="medium"
              type="success"
              icon="salida"
            />
          ) : (
            <InfoPill
              value="Salida"
              size="medium"
              type="warning"
              icon="close"
            />
          )}
        </Info>
 */
}

/**
 *   
  const handleCloseInscripcion = () => {
    console.log(id_capacitacion);
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: false },
    };
    setParamUpdated({ key: "allow_inscripcion", value: false });
    editCapacitacion(dataBody);
  };

  const handleOpenInscripcion = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: true },
    };
    setParamUpdated({ key: "allow_inscripcion", value: true });
    editCapacitacion(dataBody);
  };

  const handleCloseEntrada = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_entrada: false },
    };
    setParamUpdated({ key: "allow_asistencia_entrada", value: false });
    editCapacitacion(dataBody);
  };

  const handleOpenEntrada = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_entrada: true },
    };
    setParamUpdated({ key: "allow_asistencia_entrada", value: true });
    editCapacitacion(dataBody);
  };

  const handleCloseSalida = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_salida: false },
    };
    setParamUpdated({ key: "allow_asistencia_salida", value: false });
    editCapacitacion(dataBody);
  };

  const handleOpenSalida = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_salida: true },
    };
    setParamUpdated({ key: "allow_asistencia_salida", value: true });
    editCapacitacion(dataBody);
  };
 */

/**

  const [isInscripcionOpen, setIsInscripcionOpen] = useState(allow_inscripcion);
  const [isAsistenciaEntradaOpen, setIsAsistenciaEntradaOpen] = useState(
    allow_asistencia_entrada
  );
  const [isAsistenciaSalidaOpen, setIsAsistenciaSalidaOpen] = useState(
    allow_asistencia_salida
  );

   */

/**      <Footer>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center justify-center">
          <div className="col-span-6 md:col-span-2">
            {isInscripcionOpen ? (
              <Button
                value="Inscripciones"
                type="warning"
                size="medium"
                icon="close"
                onClick={handleCloseInscripcion}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            ) : (
              <Button
                value="Inscripciones"
                type="success"
                size="medium"
                icon="inscripciones"
                onClick={handleOpenInscripcion}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            )}
          </div>
          <div className="col-span-6 md:col-span-2">
            {isAsistenciaEntradaOpen ? (
              <Button
                value="Entrada"
                type="warning"
                size="medium"
                icon="close"
                onClick={handleCloseEntrada}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            ) : (
              <Button
                value="Entrada"
                type="success"
                size="medium"
                icon="entrada"
                onClick={handleOpenEntrada}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            )}
          </div>
          <div className="col-span-6 md:col-span-2">
            {isAsistenciaSalidaOpen ? (
              <Button
                value="Salida"
                type="warning"
                size="medium"
                icon="close"
                onClick={handleCloseSalida}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            ) : (
              <Button
                value="Salida"
                type="success"
                size="medium"
                icon="salida"
                onClick={handleOpenSalida}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            )}
          </div>
          <div className="col-span-6 md:col-span-3">
            <Link className="" to={`/eventos/editarEvento/${id_capacitacion}`}>
              <Button
                value="Editar"
                type="info"
                size="medium"
                icon="edit"
                extra="w-full"
              />
            </Link>

            <Button
              value="Eliminar"
              type="error"
              size="medium"
              icon="delete"
              onClick={() => setModalOpen(true)}
              extra="w-full"
            />
          </div>
          <div className="col-span-6 md:col-span-3"></div>
        </div>
      </Footer> */
