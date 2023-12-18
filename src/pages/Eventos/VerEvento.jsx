import React from "react";

import { useParams } from "react-router-dom";
import { useGetCapacitacionQuery } from "@redux/services/evento/eventoApi";

import { Loader, FetchError } from "@components";
import VerJornadaInnovacion from "./JornadaInnovacion/VerJornadaInnovacion";
import VerCharla from "./Charla/VerCharla";
import VerObservacionAulica from "./ObservacionAulica/VerObservacionAulica";
import VerTaller from "./Taller/VerTaller";

const VerEvento = () => {
  const { idEvento } = useParams();

  const {
    data,
    refetch: refetchVerEvento,
    error,
    isLoading,
    isFetching,
    isError,
  } = useGetCapacitacionQuery({ value: idEvento });

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const capacitacion = data.respuesta.capacitacion;
  const tipo_evento = capacitacion.tipo;

  //console.log(capacitacion);

  const handleRefetch = () => {
    //console.log("refetching handleRefetch");
    refetchVerEvento();
  };

  if (tipo_evento === "jornada") {
    return (
      <VerJornadaInnovacion
        allow_asistencia_entrada={capacitacion.allow_asistencia_entrada}
        allow_asistencia_salida={capacitacion.allow_asistencia_salida}
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        nombre_tutor={capacitacion.nombre_tutor}
        isPresencial={capacitacion.presencial}
        talleres={capacitacion.talleres}
        handleRefetch={handleRefetch}
      />
    );
  } else if (tipo_evento === "charla") {
    return (
      <VerCharla
        allow_asistencia_entrada={capacitacion.allow_asistencia_entrada}
        allow_asistencia_salida={capacitacion.allow_asistencia_salida}
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        docentesInscritos={capacitacion.docentes_inscritos}
        docentesPendientes={capacitacion.docentes_pendientes}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        nombre_tutor={capacitacion.nombre_tutor}
        isPresencial={capacitacion.presencial}
        handleRefetch={handleRefetch}
      />
    );
  } else if (tipo_evento === "taller") {
    return (
      <VerTaller
        allow_asistencia_entrada={capacitacion.allow_asistencia_entrada}
        allow_asistencia_salida={capacitacion.allow_asistencia_salida}
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        docentesInscritos={capacitacion.docentes_inscritos}
        docentesPendientes={capacitacion.docentes_pendientes}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        nombre_tutor={capacitacion.nombre_tutor}
        isPresencial={capacitacion.presencial}
        handleRefetch={handleRefetch}
      />
    );
  } else if (tipo_evento === "observacion") {
    return (
      <VerObservacionAulica
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        docentesInscritos={capacitacion.docentes_inscritos}
        docentesPendientes={capacitacion.docentes_pendientes}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        isPresencial={capacitacion.presencial}
        handleRefetch={handleRefetch}
      />
    );
  } else {
    return <div className="bg-red-500">Revisando Evento {idEvento}</div>;
  }
};

export default VerEvento;
