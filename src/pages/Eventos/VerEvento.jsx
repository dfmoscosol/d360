import React from "react";

import { useParams } from "react-router-dom";
import { useGetEventoQuery } from "@redux/services/evento/eventoApi";

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
  } = useGetEventoQuery({ value: idEvento }); 

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const evento = data.respuesta.evento;

  const handleRefetch = () => {
    refetchVerEvento();
  };

  if (evento.tipo === 1) {
    return (
      <VerJornadaInnovacion
        inscripcion={evento.inscripcion}
        cupos={evento.cupos}
        fechas={evento.fechas}
        horas={evento.horas}
        id={evento.id}
        nombre={evento.nombre}
        talleres={evento.talleres}
        handleRefetch={handleRefetch}
      />
    );
  }  else if (evento.tipo === 2) {
    return (
      <VerCharla
        inscripcion={evento.inscripcion}
        cupos={evento.cupos}
        fechas={evento.fechas}
        docentesInscritos={evento.docentes_inscritos}
        docentesPendientes={evento.docentes_pendientes}
        horas={evento.horas}
        id={evento.id}
        modalidad={evento.modalidad}
        competencia={evento.competencia}
        momento={evento.momento}
        ubicacion={evento.ubicacion}
        duracion={evento.duracion}
        hora_inicio={evento.hora_inicio}
        nombre={evento.nombre}
        ponentes={evento.ponentes}
        descripcion={evento.descripcion}
        handleRefetch={handleRefetch}
      />
    );
  } else if (evento.tipo === 3) {
    {console.log(evento.id)}
    return (
      <VerTaller
        inscripcion={evento.inscripcion}
        cupo={evento.cupos}
        docentesInscritos={evento.docentes_inscritos}
        docentesPendientes={evento.docentes_pendientes}
        fechas={evento.fechas}
        horas={evento.horas}
        competencia={evento.competencia}
        momento={evento.momento}
        id={evento.id}
        nombre={evento.nombre}
        sesiones={evento.sesiones}
        descripcion={evento.descripcion}
        ponentes={evento.ponentes}
        handleRefetch={handleRefetch}
      />
    );
  } else if (evento.tipo === 4) {
    return (
      <VerObservacionAulica
        inscripcion={evento.inscripcion}
        cupo={evento.cupos}
        docentesInscritos={evento.docentes_inscritos}
        docentesPendientes={evento.docentes_pendientes}
        fechas={evento.fechas}
        horas={evento.horas}
        id={evento.id}
        nombre={evento.nombre}
        handleRefetch={handleRefetch}
      />
    );
  } else {
    return <div className="bg-red-500">Revisando Evento {idEvento}</div>;
  } 
};

export default VerEvento;
