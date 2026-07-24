import React from "react";

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

const VerTaller = (props) => {
  /**
   * PROPS
   */
  const {
    inscripcion,
    acreditacion,
    cupo,
    docentesInscritos,
    docentesPendientes,
    fechas,
    horas,
    id,
    nombre,
    sesiones,
    ponentes,
    descripcion,
    competencias,
    momento,
    handleRefetch,
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
                  headerTitle="Microtaller"
                  headerSubTitle="Evento"
                  headerLinkToNew="/eventos/nuevoEvento/microtaller"
                  headerLinkToEdit={`/eventos/editarEvento/${id}`}
                  id={id}
                  routeType={'microtalleres'}
                  containerNombre={nombre}
                  containerFechas={fechas}
                  competencias={competencias}
                  momento={momento}
                  containerDataList={[
                    {
                      key: "Descripción",
                      value: descripcion,
                    },
                    {
                      key: "Cupo",
                      value: cupo,
                    },
                    {
                      key: "Horas",
                      value: horas,
                    }
                  ]}
                  toggleAllowInscripcion={inscripcion}
                  toggleAllowAcreditacion={acreditacion}
                  isMicrotaller={true}
                  sesiones={sesiones}
                  ponentes={ponentes}
                  handleRefetch={handleRefetch}
                />
              ),
            },
            {
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
              title: `Inscritos (${docentesInscritos.length})`,
              icon: <MdCheckBox size={20} />,
              index: 2,
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
              index: 3,
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

export default VerTaller;
