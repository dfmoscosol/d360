import React from "react";

import JornadaInnovacionCard from "../../../JornadaInnovacion/components/Card/JornadaInnovacionCard";
import ObservacionAulicaCard from "../../../ObservacionAulica/components/Card/ObservacionAulicaCard";
import CharlaCard from "../../../Charla/components/Card/CharlaCard";
import TallerCard from "../../../Taller/components/Card/TallerCard";

const Card = (props) => {
  const { type, data } = props;

  if (type === 1) {
    return (
      <JornadaInnovacionCard
        inscripcion={data.inscripcion}
        fechas={data.fechas}
        id={data.id}
        nombre={data.nombre}
      />
    );
  } else if (type === 4) {
    return (
      <ObservacionAulicaCard
        inscripcion={data.inscripcion}
        fechas={data.fechas}
        id={data.id_capacitacion}
        nombre={data.nombre}
      />
    );
  } else if (type === 2) {
    return (
      <CharlaCard
        inscripcion={data.inscripcion}
        fechas={data.fechas}
        id={data.id_capacitacion}
        nombre={data.nombre}
      />
    );
  } else if (type === 3) {
    return (
      <TallerCard
        inscripcion={data.inscripcion}
        fechas={data.fechas}
        id={data.id_capacitacion}
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
