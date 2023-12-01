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

  const { data, error, isLoading, isFetching, isError } =
    useGetCapacitacionQuery({ value: idEvento });

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const capacitacion = data.respuesta.capacitacion;
  const tipo_evento = capacitacion.tipo;

  console.log(capacitacion);
  console.log(tipo_evento);

  if (tipo_evento === "Jornada") {
    return (
      <VerJornadaInnovacion
        allow_asistencia={capacitacion.allow_asistencia}
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
      />
    );
  } else if (tipo_evento === "Charla") {
    return (
      <VerCharla
        allow_asistencia={capacitacion.allow_asistencia}
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        nombre_tutor={capacitacion.nombre_tutor}
        isPresencial={capacitacion.presencial}
      />
    );
  } else if (tipo_evento === "Taller") {
    return (
      <VerTaller
        allow_asistencia={capacitacion.allow_asistencia}
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        nombre_tutor={capacitacion.nombre_tutor}
        isPresencial={capacitacion.presencial}
      />
    );
  } else if (tipo_evento === "Observación Aulica") {
    return (
      <VerObservacionAulica
        allow_inscripcion={capacitacion.allow_inscripcion}
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        isPresencial={capacitacion.presencial}
      />
    );
  } else {
    return <div className="bg-red-500">Revisando Evento {idEvento}</div>;
  }
};

export default VerEvento;
