import React from "react";

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

import InscripcionesTab from "../InscripcionesTab/InscripcionesTab";

const EnrollSection = ({ idEvento, handleRefetch, idTaller, docentesInscritos }) => {
  return (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        title="Inscribir"
        subTitle="Inscripción masiva de docentes"
        hasIcon={false}
      />
      <SectionContainer>
        <InscripcionesTab
          id={idEvento}
          docentesInscritos={docentesInscritos}
          handleRefetch={handleRefetch}
          idTaller={idTaller}
        />
      </SectionContainer>
    </EventoView>
  );
};

export default EnrollSection;
