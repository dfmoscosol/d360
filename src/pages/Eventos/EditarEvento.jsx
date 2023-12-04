import React from "react";

import { useParams } from "react-router-dom";
import { useGetCapacitacionQuery } from "@redux/services/evento/eventoApi";

import EditarJornadaInnovacion from "./JornadaInnovacion/EditarJornadaInnovacion";
import EditarCharla from "./Charla/EditarCharla";
import EditarObservacionAulica from "./ObservacionAulica/EditarObservacionAulica";
import EditarTaller from "./Taller/EditarTaller";

import { Loader, FetchError } from "@components";

const EditarEvento = () => {
  const { idEvento } = useParams();

  const { data, error, isLoading, isFetching, isError } =
    useGetCapacitacionQuery({ value: idEvento });

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const capacitacion = data.respuesta.capacitacion;
  const tipo_evento = capacitacion.tipo;

  if (tipo_evento === "Jornada") {
    return (
      <EditarJornadaInnovacion
        nombre={capacitacion.nombre}
        nombre_tutor={capacitacion.nombre_tutor}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        isPresencial={capacitacion.presencial}
        direccion={capacitacion.direccion}
        cupo={capacitacion.cupo}
        talleres={capacitacion.talleres}
        allow_asistencia={capacitacion.allow_asistencia}
        allow_inscripcion={capacitacion.allow_inscripcion}
        id_capacitacion={capacitacion.id_capacitacion}
      />
    );
  } else if (tipo_evento === "Charla") {
    return (
      <EditarCharla
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
      <EditarObservacionAulica
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        isPresencial={capacitacion.presencial}
      />
    );
  } else if (tipo_evento === "Taller") {
    return (
      <EditarTaller
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
  } else {
    return <div className="bg-red-500">Revisando Evento {idEvento}</div>;
  }
};

export default EditarEvento;
