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


const VerCharla = (props) => {
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
                  headerTitle="Charla"
                  headerSubTitle="Capacitación"
                  headerLinkToNew="/eventos/nuevoEvento/charla"
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

export default VerCharla;

{
  /**
        <Info>
          {isInscripcionOpen ? (
            <InfoPill
              value="Inscripciones"
              size="medium"
              type="success"
              icon="inscripciones"
            />
          ) : (
            <InfoPill
              value="Inscripciones"
              size="medium"
              type="warning"
              icon="close"
            />
          )}
          {isAsistenciaEntradaOpen ? (
            <InfoPill
              value="Entrada"
              size="medium"
              type="success"
              icon="entrada"
            />
          ) : (
            <InfoPill
              value="Entrada"
              size="medium"
              type="warning"
              icon="close"
            />
          )}
          {isAsistenciaSalidaOpen ? (
            <InfoPill
              value="Salida"
              size="medium"
              type="success"
              icon="salida"
            />
          ) : (
            <InfoPill
              value="Salida"
              size="medium"
              type="warning"
              icon="close"
            />
          )}
        </Info>
 */
}

/**
 *   
  const handleCloseInscripcion = () => {
    console.log(id_capacitacion);
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: false },
    };
    setParamUpdated({ key: "allow_inscripcion", value: false });
    editCapacitacion(dataBody);
  };

  const handleOpenInscripcion = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_inscripcion: true },
    };
    setParamUpdated({ key: "allow_inscripcion", value: true });
    editCapacitacion(dataBody);
  };

  const handleCloseEntrada = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_entrada: false },
    };
    setParamUpdated({ key: "allow_asistencia_entrada", value: false });
    editCapacitacion(dataBody);
  };

  const handleOpenEntrada = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_entrada: true },
    };
    setParamUpdated({ key: "allow_asistencia_entrada", value: true });
    editCapacitacion(dataBody);
  };

  const handleCloseSalida = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_salida: false },
    };
    setParamUpdated({ key: "allow_asistencia_salida", value: false });
    editCapacitacion(dataBody);
  };

  const handleOpenSalida = () => {
    const dataBody = {
      id: id_capacitacion,
      body: { allow_asistencia_salida: true },
    };
    setParamUpdated({ key: "allow_asistencia_salida", value: true });
    editCapacitacion(dataBody);
  };
 */

/**

  const [isInscripcionOpen, setIsInscripcionOpen] = useState(allow_inscripcion);
  const [isAsistenciaEntradaOpen, setIsAsistenciaEntradaOpen] = useState(
    allow_asistencia_entrada
  );
  const [isAsistenciaSalidaOpen, setIsAsistenciaSalidaOpen] = useState(
    allow_asistencia_salida
  );

   */

/**      <Footer>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center justify-center">
          <div className="col-span-6 md:col-span-2">
            {isInscripcionOpen ? (
              <Button
                value="Inscripciones"
                type="warning"
                size="medium"
                icon="close"
                onClick={handleCloseInscripcion}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            ) : (
              <Button
                value="Inscripciones"
                type="success"
                size="medium"
                icon="inscripciones"
                onClick={handleOpenInscripcion}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            )}
          </div>
          <div className="col-span-6 md:col-span-2">
            {isAsistenciaEntradaOpen ? (
              <Button
                value="Entrada"
                type="warning"
                size="medium"
                icon="close"
                onClick={handleCloseEntrada}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            ) : (
              <Button
                value="Entrada"
                type="success"
                size="medium"
                icon="entrada"
                onClick={handleOpenEntrada}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            )}
          </div>
          <div className="col-span-6 md:col-span-2">
            {isAsistenciaSalidaOpen ? (
              <Button
                value="Salida"
                type="warning"
                size="medium"
                icon="close"
                onClick={handleCloseSalida}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            ) : (
              <Button
                value="Salida"
                type="success"
                size="medium"
                icon="salida"
                onClick={handleOpenSalida}
                isLoading={isUpdatingEdit}
                extra="w-full"
              />
            )}
          </div>
          <div className="col-span-6 md:col-span-3">
            <Link className="" to={`/eventos/editarEvento/${id_capacitacion}`}>
              <Button
                value="Editar"
                type="info"
                size="medium"
                icon="edit"
                extra="w-full"
              />
            </Link>

            <Button
              value="Eliminar"
              type="error"
              size="medium"
              icon="delete"
              onClick={() => setModalOpen(true)}
              extra="w-full"
            />
          </div>
          <div className="col-span-6 md:col-span-3"></div>
        </div>
      </Footer> */
