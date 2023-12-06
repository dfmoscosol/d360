import React from "react";

import JornadaInnovacionCard from "../../../JornadaInnovacion/components/Card/JornadaInnovacionCard";
import ObservacionAulicaCard from "../../../ObservacionAulica/components/Card/ObservacionAulicaCard";
import CharlaCard from "../../../Charla/components/Card/CharlaCard";
import TallerCard from "../../../Taller/components/Card/TallerCard";

const Card = (props) => {
  const { type, data } = props;

  if (type === "jornada") {
    return (
      <JornadaInnovacionCard
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
        fechas={data.fechas}
        allow_inscripcion={data.allow_inscripcion}
        horas={data.horas}
        length_talleres={data.talleres.length}
      />
    );
  } else if (type === "observacion") {
    return (
      <ObservacionAulicaCard
        allow_inscripcion={data.allow_inscripcion}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
        fechas={data.fechas}
        horas={data.horas}
        cupo={data.cupo}
      />
    );
  } else if (type === "charla") {
    return (
      <CharlaCard
        allow_asistencia_entrada={data.allow_asistencia_entrada}
        allow_asistencia_salida={data.allow_asistencia_salida}
        allow_inscripcion={data.allow_inscripcion}
        cupo={data.cupo}
        direccion={data.direccion}
        fechas={data.fechas}
        horas={data.horas}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
        nombre_tutor={data.nombre_tutor}
        numero_inscritos={data.numero_inscritos}
        isPresencial={data.presencial}
      />
    );
  } else if (type === "taller") {
    return (
      <TallerCard
        allow_asistencia={data.allow_asistencia}
        allow_inscripcion={data.allow_inscripcion}
        cupo={data.cupo}
        direccion={data.direccion}
        fechas={data.fechas}
        horas={data.horas}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
        nombre_tutor={data.nombre_tutor}
        isPresencial={data.presencial}
      />
    );
  } else {
    return (
      <div className="bg-primary_gray_1 rounded-xl p-4 flex flex-col">
        <span>Type not defined yet</span>
      </div>
    );
  }
};

export default Card;
