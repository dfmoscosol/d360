import React,{useState} from "react";
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
  const { inscripcion, cupos, fechas, horas, id, nombre, talleres, handleRefetch } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (index) => {
    setActiveIndex(index);
  };

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
        routeType="jornadas"
        headerSubTitle="Evento"
        headerLinkToNew="/eventos/nuevoEvento/jornadaInnovacion"
        headerLinkToEdit={`/eventos/editarEvento/${id}`}
        id={id}
        containerNombre={nombre}
        containerFechas={fechas}
        containerDataList={[
          { key: "Cupo", value: cupos },
          { key: "Horas", value: horas },
          { key: "Talleres", value: talleres.length },
        ]}
        toggleAllowInscripcion={inscripcion}
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
      title: taller.nombre,
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
              idTaller={taller.id}
              idEvento={id}
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
              idEvento={id}
              idTaller={taller.id}
              docentesInscritos={taller.docentes_inscritos}
              handleRefetch={handleRefetch}
            />
          ),
        },
      ],
    });
    contIndex += 3;
  });

  return (
    <ContainerPage>
      <EventoView extra={"p-4 md:p-6"}>
        <Tabs tabList={talleresInfo} activeIndex={activeIndex} onTabChange={handleTabChange} />
      </EventoView>
    </ContainerPage>
  );
};

export default VerJornadaInnovacion;
