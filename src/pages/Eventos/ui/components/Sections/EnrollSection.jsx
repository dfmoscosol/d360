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

const EnrollSection = ({ idCapacitacion, handleRefetch, idTaller }) => {
  return (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        title="Inscribir"
        subTitle="Inscripción manual de docentes"
        hasIcon={false}
      />
      <SectionContainer>
        <InscripcionesTab
          id={idCapacitacion}
          handleRefetch={handleRefetch}
          idTaller={idTaller}
        />
      </SectionContainer>
    </EventoView>
  );
};

export default EnrollSection;
