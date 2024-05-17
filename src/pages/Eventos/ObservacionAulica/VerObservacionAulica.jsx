import React, { useState, useEffect } from "react";

import {
  useEditEventoMutation,
  useDeleteEventoMutation,
} from "@redux/services/evento/eventoApi";
import { Notification, Modal, InfoPill } from "@components";
import { Link } from "react-router-dom";

import {
  MdDoNotTouch,
  MdOutlineEmojiPeople,
  MdDateRange,
  MdDelete,
  MdOutlineEdit,
  MdAdd,
} from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";

import EventoView from "../ui/components/EventoView/EventoView";
import InformationSection from "../ui/components/Sections/InformationSection";
import AprobationSection from "../ui/components/Sections/AprobationSection";
import InscribedSection from "../ui/components/Sections/InscribedSection";
import EnrollSection from "../ui/components/Sections/EnrollSection";
import { ContainerPage } from "@components";
import Tabs from "../ui/components/Tabs/Tabs";
import { GrWorkshop } from "react-icons/gr";
import {
  MdPersonAddAlt1,
  MdOutlineChecklistRtl,
  MdCheckBox,
} from "react-icons/md";

const VerObservacionAulica = (props) => {
  /**
   * PROPS
   */
  const {
    allow_inscripcion,
    cupo,
    direccion,
    docentesInscritos,
    docentesPendientes,
    fechas,
    horas,
    id_capacitacion,
    nombre,
    isPresencial,
    handleRefetch,
  } = props;

  /**
   * MODALIDAD
   */
  let modalidad = "";
  if (isPresencial) {
    modalidad = "Presencial";
  } else {
    modalidad = "Virtual";
  }

  return (
    <ContainerPage>
      <EventoView extra={"p-4 md:p-6"}>
        <Tabs
          tabList={[
            {
              hasTitle: false,
              title: "Información",
              icon: <SiGoogleclassroom size={20} />,
              index: 0,
              content: (
                <InformationSection
                  headerIcon={<SiGoogleclassroom size={25} />}
                  headerTitle="Observación Áulica"
                  headerSubTitle="Capacitación"
                  headerLinkToNew="/eventos/nuevoEvento/observacionAulica"
                  headerLinkToEdit={`/eventos/editarEvento/${id_capacitacion}`}
                  idCapacitacion={id_capacitacion}
                  containerNombre={nombre}
                  containerFechas={fechas}
                  containerDataList={[
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
                    {
                      key: "Inscritos",
                      value: docentesInscritos.length,
                    },
                    {
                      key: "Por Aprobar",
                      value: docentesPendientes.length,
                    },
                  ]}
                  //toggleAllowEntrada={allow_asistencia_entrada}
                  //toggleAllowSalida={allow_asistencia_salida}
                  toggleAllowInscripcion={allow_inscripcion}
                  handleRefetch={handleRefetch}
                />
              ),
            },
            {
              hasTitle: false,
              title: `Aprobar (${docentesPendientes.length})`,
              icon: <MdOutlineChecklistRtl size={20} />,
              index: 1,
              content: (
                <AprobationSection
                  docentesPendientes={docentesPendientes}
                  handleRefetch={handleRefetch}
                />
              ),
            },
            {
              hasTitle: false,
              title: `Inscritos (${docentesInscritos.length})`,
              icon: <MdCheckBox size={20} />,
              index: 2,
              content: (
                <InscribedSection
                  docentesInscritos={docentesInscritos}
                  handleRefetch={handleRefetch}
                />
              ),
            },
            {
              hasTitle: false,
              title: "Inscribir",
              icon: <MdPersonAddAlt1 size={20} />,
              index: 3,
              content: (
                <EnrollSection
                  idCapacitacion={id_capacitacion}
                  handleRefetch={handleRefetch}
                />
              ),
            },
          ]}
          activeIndex={0}
        />
      </EventoView>
    </ContainerPage>
  );
};

export default VerObservacionAulica;
