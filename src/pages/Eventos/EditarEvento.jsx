import React from "react";

import { useParams } from "react-router-dom";
import { useGetEventoQuery } from "@redux/services/evento/eventoApi";

import EditarJornadaInnovacion from "./JornadaInnovacion/EditarJornadaInnovacion";
import EditarCharla from "./Charla/EditarCharla";
import EditarObservacionAulica from "./ObservacionAulica/EditarObservacionAulica";
import EditarTaller from "./Taller/EditarTaller";

import { Loader, FetchError } from "@components";

const EditarEvento = () => {
  const { idEvento } = useParams();

  const {
    data,
    refetch: refetchVerEvento,
    error,
    isLoading,
    isFetching,
    isError,
  } = useGetEventoQuery({ value: idEvento });

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const evento = data.respuesta.evento;
  const tipo_evento = evento.tipo;

  const handleRefetch = () => {
    //console.log("refetching handleRefetch");
    refetchVerEvento();
  };

  if (tipo_evento === 1) {
    return (
      <EditarJornadaInnovacion
        nombre={evento.nombre}
        fechas={evento.fechas}
        horas={evento.horas}
        cupos={evento.cupos}
        talleres={evento.talleres}
        id={evento.id}
        handleRefetch={handleRefetch}
      />
    );
  } /* else if (tipo_evento === "charla") {
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
        handleRefetch={handleRefetch}
      />
    );
  } else if (tipo_evento === "observacion") {
    return (
      <EditarObservacionAulica
        cupo={capacitacion.cupo}
        direccion={capacitacion.direccion}
        fechas={capacitacion.fechas}
        horas={capacitacion.horas}
        id_capacitacion={capacitacion.id_capacitacion}
        nombre={capacitacion.nombre}
        isPresencial={capacitacion.presencial}
        handleRefetch={handleRefetch}
      />
    );
  } else if (tipo_evento === "taller") {
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
        handleRefetch={handleRefetch}
      />
    );
  }  */else {
    return <div className="bg-red-500">Revisando Evento {idEvento}</div>;
  }
};

export default EditarEvento;
