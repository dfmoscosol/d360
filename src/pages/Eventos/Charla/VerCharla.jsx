import React from "react";
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
  MdCheckBox,
} from "react-icons/md";


const VerCharla = (props) => {
  /**
   * PROPS
   */
  const {
    inscripcion,
    cupos,
    fechas,
    docentesInscritos,
    docentesPendientes,
    horas,
    id,
    nombre,
    ubicacion,
    modalidad,
    competencias,
    momento,
    duracion,
    hora_inicio,
    ponentes,
    descripcion,
    handleRefetch,
    acreditacion,
    microcredencial,
  } = props;


  return (
    <ContainerPage>
      <EventoView extra={"p-4 md:p-6"}>
        <Tabs
          tabList={[
            {
              title: "Información",
              icon: <GrWorkshop size={20} />,
              index: 0,
              content: (
                <InformationSection
                  headerIcon={<GrWorkshop size={25} />}
                  headerTitle="Charla"
                  headerSubTitle="Evento"
                  headerLinkToNew="/eventos/nuevoEvento/charla"
                  headerLinkToEdit={`/eventos/editarEvento/${id}`}
                  id={id}
                  routeType={'charlas'}
                  containerNombre={nombre}
                  containerFechas={fechas}
                  competencias={competencias}
                  momento={momento}
                  microcredencial={microcredencial}
                  containerDataList={[
                    
                    {
                      key: "Descripción",
                      value: descripcion,
                    },
                    {
                      key: "Cupo",
                      value: cupos,
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
                      key: "Ubicación",
                      value: ubicacion,
                    },
                    {
                      key: "Hora de Inicio",
                      value: hora_inicio,
                    },
                    {
                      key: "Duración",
                      value: duracion,
                    }                    
                  ]}
                  toggleAllowInscripcion={inscripcion}
                  toggleAllowAcreditacion={acreditacion}
                  handleRefetch={handleRefetch}
                  hasTalleres={false}
                  isCharla={true}
                  ponentes={ponentes}
                />
              ),
            },
            {
              title: `Inscritos (${docentesInscritos.length})`,
              icon: <MdCheckBox size={20} />,
              index: 1,
              content: (
                <InscribedSection
                  docentesInscritos={docentesInscritos}
                  handleRefetch={handleRefetch}
                  idEvento={id}
                />
              ),
            },
            {
              title: "Inscribir",
              icon: <MdPersonAddAlt1 size={20} />,
              index: 2,
              content: (
                <EnrollSection
                  idEvento={id}
                  docentesInscritos={docentesInscritos}
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

export default VerCharla;
