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
        allow_asistencia_entrada={data.allow_asistencia_entrada}
        allow_asistencia_salida={data.allow_asistencia_salida}
        allow_inscripcion={data.allow_inscripcion}
        fechas={data.fechas}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
      />
    );
  } else if (type === "observacion") {
    return (
      <ObservacionAulicaCard
        allow_inscripcion={data.allow_inscripcion}
        fechas={data.fechas}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
      />
    );
  } else if (type === "charla") {
    return (
      <CharlaCard
        allow_asistencia_entrada={data.allow_asistencia_entrada}
        allow_asistencia_salida={data.allow_asistencia_salida}
        allow_inscripcion={data.allow_inscripcion}
        fechas={data.fechas}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
      />
    );
  } else if (type === "taller") {
    return (
      <TallerCard
        allow_asistencia_entrada={data.allow_asistencia_entrada}
        allow_asistencia_salida={data.allow_asistencia_salida}
        allow_inscripcion={data.allow_inscripcion}
        fechas={data.fechas}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
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
