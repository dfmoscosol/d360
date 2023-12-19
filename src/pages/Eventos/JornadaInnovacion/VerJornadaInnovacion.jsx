import React from "react";
import { GiTeamIdea } from "react-icons/gi";
import EventoView from "../ui/components/EventoView/EventoView";
import InformationSection from "../ui/components/Sections/InformationSection";
import { ContainerPage } from "@components";
import Tabs from "../ui/components/Tabs/Tabs";
import AprobationSection from "../ui/components/Sections/AprobationSection";
import InscribedSection from "../ui/components/Sections/InscribedSection";
import EnrollSection from "../ui/components/Sections/EnrollSection";
import {
  MdPersonAddAlt1,
  MdOutlineChecklistRtl,
  MdCheckBox,
} from "react-icons/md";

const VerJornadaInnovacion = (props) => {
  /**
   * PROPS
   */
  const {
    allow_asistencia_entrada,
    allow_asistencia_salida,
    allow_inscripcion,
    cupo,
    direccion,
    fechas,
    horas,
    id_capacitacion,
    nombre,
    nombre_tutor,
    isPresencial,
    talleres,
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

  let talleresInfo = [];

  talleresInfo.push({
    hasTitle: false,
    title: "Información",
    icon: <GiTeamIdea size={20} />,
    index: 0,
    content: (
      <InformationSection
        headerIcon={<GiTeamIdea size={25} />}
        headerTitle="Jornada de Innovación"
        headerSubTitle="Capacitación"
        headerLinkToNew="/eventos/nuevoEvento/jornadaInnovacion"
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
            key: "Tutor",
            value: nombre_tutor,
          },
          {
            key: "Talleres",
            value: talleres.length,
          },
        ]}
        toggleAllowEntrada={allow_asistencia_entrada}
        toggleAllowSalida={allow_asistencia_salida}
        toggleAllowInscripcion={allow_inscripcion}
        handleRefetch={handleRefetch}
        hasTalleres={true}
        talleresList={talleres}
      />
    ),
  });

  let contIndex = 0;
  talleres.forEach((taller, index) => {
    talleresInfo.push({
      hasTitle: true,
      title: `Taller ${index + 1}`,
      data: [
        {
          index: contIndex + 1,
          title: `Aprobar (${taller.docentes_pendientes.length})`,
          icon: <MdOutlineChecklistRtl size={20} />,
          content: (
            <AprobationSection
              docentesPendientes={taller.docentes_pendientes}
              handleRefetch={handleRefetch}
            />
          ),
        },
        {
          index: contIndex + 2,
          title: `Inscritos (${taller.docentes_inscritos.length})`,
          icon: <MdCheckBox size={20} />,
          content: (
            <InscribedSection
              docentesInscritos={taller.docentes_inscritos}
              handleRefetch={handleRefetch}
            />
          ),
        },
        {
          index: contIndex + 3,
          title: "Inscribir",
          icon: <MdPersonAddAlt1 size={20} />,
          content: (
            <EnrollSection
              idCapacitacion={id_capacitacion}
              idTaller={taller.id_taller}
              handleRefetch={handleRefetch}
            />
          ),
        },
      ],
    });
    contIndex += 3;
  });

  //console.log("talleresInfo");
  //console.log(talleresInfo);

  return (
    <ContainerPage>
      <EventoView extra={"p-4 md:p-6"}>
        <Tabs tabList={talleresInfo} activeIndex={0} />
      </EventoView>
    </ContainerPage>
  );
};

export default VerJornadaInnovacion;
