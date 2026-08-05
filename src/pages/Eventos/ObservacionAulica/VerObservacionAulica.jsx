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
import InscribedSection from "../ui/components/Sections/InscribedSection";
import EnrollSection from "../ui/components/Sections/EnrollSection";
import { ContainerPage } from "@components";
import Tabs from "../ui/components/Tabs/Tabs";
import { GrWorkshop } from "react-icons/gr";
import {
  MdPersonAddAlt1,
  MdOutlineChecklistRtl,
  MdCheckBox,MdOutlinePersonSearch 
} from "react-icons/md";
import ObserverSection from "../ui/components/Sections/ObserverSection";

const VerObservacionAulica = (props) => {
  /**
   * PROPS
   */
  const {
    inscripcion,
    cupo,
    docentesInscritos,
    docentesPendientes,
    fechas,
    horas,
    id,
    nombre,
    handleRefetch,
    acreditacion,
  } = props;



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
                  headerSubTitle="Evento"
                  headerLinkToNew="/eventos/nuevoEvento/observacionAulica"
                  headerLinkToEdit={`/eventos/editarEvento/${id}`}
                  id={id}
                  routeType="observaciones"
                  containerNombre={nombre}
                  containerFechas={fechas}
                  containerDataList={[
                    {
                      key: "Cupo",
                      value: cupo,
                    },
                    {
                      key: "Horas",
                      value: horas,
                    }
                  ]}
                  //toggleAllowEntrada={allow_asistencia_entrada}
                  //toggleAllowSalida={allow_asistencia_salida}
                  toggleAllowInscripcion={inscripcion}
                  toggleAllowAcreditacion={acreditacion}
                  handleRefetch={handleRefetch}
                />
              ),
            },
            {
              hasTitle: false,
              title: "Observadores",
              icon: <MdOutlinePersonSearch size={20} />,
              index: 1,
              content: (
                <ObserverSection
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
                  idEvento={id}
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
