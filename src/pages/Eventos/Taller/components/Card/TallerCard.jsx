import React from "react";

import { Link } from "react-router-dom";
import StatePill from "../../../ui/components/StatePill/StatePill";
import EventTypeBadge from "../../../ui/components/EventTypeBadge/EventTypeBadge";
import { MdDateRange } from "react-icons/md";

const TallerCard = (props) => {
  const {
    acreditacion,
    inscripcion,
    fechas,
    id,
    nombre,
  } = props;

  return (
    <div className="bg-white p-4 flex flex-col gap-4 rounded-lg hover:shadow-lg transition-all duration-300 h-full border-l-4 hover:scale-[1.02] cursor-pointer" style={{ borderLeftColor: '#4d4d4d' }}>
      <Link
        to={`verEvento/${id}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex flex-col items-start gap-2 w-full">
          <span className="text-lg font-medium text-primary_text_1 line-clamp-2 tracking-tight leading-tight">
            {nombre}
          </span>
          <EventTypeBadge type={3} typeName="Microtaller" />
        </div>
        <div className="flex gap-2">
          {fechas.map((fecha, index) => (
            <div
              key={index}
              className="bg-primary_gray_1 rounded-lg p-2 flex gap-1 text-primary_gray_4 items-center"
            >
              <MdDateRange size={15} />
              <span className="text-xs font-normal tracking-tight">
                {fecha.fecha}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <StatePill
            hasState={inscripcion}
            stateValue={"Inscripción"}
            icon={"inscripcion"}
            className="flex-1 w-full"
          />
          <StatePill
            hasState={acreditacion}
            stateValue={"Acreditación"}
            icon={"acreditacion"}
            className="flex-1 w-full"
          />
        </div>
      </Link>
    </div>
  );
};

export default TallerCard;
