import React from "react";

import JornadaInnovacionCard from "../../JornadaInnovacion/components/Card/JornadaInnovacionCard";
import ObservacionAulicaCard from "../../ObservacionAulica/components/Card/ObservacionAulicaCard";

const Card = (props) => {
  const { type, data } = props;

  if (type === "Jornada") {
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
  } else if (type === "Observación Aulica") {
    return (
      <ObservacionAulicaCard
        allow_inscripcion={data.allow_inscripcion}
        id_capacitacion={data.id_capacitacion}
        nombre={data.nombre}
        fecha_inicio={data.fechas[0]}
        horas={data.horas}
        cupo={data.cupo}
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
