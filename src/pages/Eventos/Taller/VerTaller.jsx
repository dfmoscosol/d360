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
              title: "Información",
              icon: <GrWorkshop size={20} />,
              index: 0,
              content: (
                <InformationSection
                  headerIcon={<GrWorkshop size={25} />}
                  headerTitle="Taller"
                  headerSubTitle="Capacitación"
                  headerLinkToNew="/eventos/nuevoEvento/taller"
                  headerLinkToEdit={`/eventos/editarEvento/${id_capacitacion}`}
                  idCapacitacion={id_capacitacion}
                  containerNombre={nombre}
                  containerFechas={fechas}
                  containerDataList={[
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
                    {
                      key: "Inscritos",
                      value: docentesInscritos.length,
                    },
                    {
                      key: "Por Aprobar",
                      value: docentesPendientes.length,
                    },
                  ]}
                  toggleAllowEntrada={allow_asistencia_entrada}
                  toggleAllowSalida={allow_asistencia_salida}
                  toggleAllowInscripcion={allow_inscripcion}
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
                />
              ),
            },
            {
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

export default VerTaller;
