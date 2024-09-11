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
  }  else if (evento.tipo === 2) {
    return (
      <EditarCharla
        cupos={evento.cupos}
        ubicacion={evento.ubicacion}
        hora_inicio={evento.hora_inicio}
        duracion={evento.duracion}
        fechas={evento.fechas}
        horas={evento.horas}
        id={evento.id}
        nombre={evento.nombre}
        modalidad={evento.modalidad}
        competencia={evento.competencia}
        momento={evento.momento}
        ponentes={evento.ponentes}
        descripcion={evento.descripcion}
        handleRefetch={handleRefetch}
      />
    );
  } else if (evento.tipo === 4) {
    return (
      <EditarObservacionAulica
        cupos={evento.cupos}
        fechas={evento.fechas}
        horas={evento.horas}
        id={evento.id}
        nombre={evento.nombre}
        handleRefetch={handleRefetch}
      />
    );
  } else if (evento.tipo === 3) {
    return (
      <EditarTaller
        cupos={evento.cupos}
        direccion={evento.direccion}
        horas={evento.horas}
        id={evento.id}
        nombre={evento.nombre}
        ponentes={evento.ponentes}
        currentSesiones={evento.sesiones}
        descripcion={evento.descripcion}
        competencia={evento.competencia}
        momento={evento.momento}
        handleRefetch={handleRefetch}
      />
    );
  }  else {
    return <div className="bg-red-500">Revisando Evento {idEvento}</div>;
  }
};

export default EditarEvento;
