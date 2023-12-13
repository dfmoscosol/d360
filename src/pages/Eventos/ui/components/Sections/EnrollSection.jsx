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

const EnrollSection = ({ idCapacitacion, handleRefetch }) => {
  return (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        //icon={<MdPersonAddAlt1 size={25} />}
        title="Inscribir"
        subTitle="Inscripción manual de docentes"
        hasIcon={false}
      />
      <SectionContainer>
        <InscripcionesTab id={idCapacitacion} handleRefetch={handleRefetch} />
      </SectionContainer>
    </EventoView>
  );
};

export default EnrollSection;
