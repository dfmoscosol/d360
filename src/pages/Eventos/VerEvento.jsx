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
  console.log(evento.talleres)

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
  }  else if (evento.tipo === 3) {
    return (
      <VerCharla
        allow_asistencia_entrada={true}
        allow_asistencia_salida={true}
        allow_inscripcion={true}
        cupo={1}
        direccion={"capacitacion.direccion"}
        docentesInscritos={[]}
        docentesPendientes={[]}
        fechas={[]}
        horas={1}
        id_capacitacion={1}
        nombre={"capacitacion.nombre"}
        nombre_tutor={"capacitacion.nombre_tutor"}
        isPresencial={true}
        handleRefetch={handleRefetch}
      />
    );
  } /*else if (tipo_evento === "taller") {
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
  } */
};

export default VerEvento;
