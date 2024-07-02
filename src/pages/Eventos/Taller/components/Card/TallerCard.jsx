import React from "react";

import { Link } from "react-router-dom";
import StatePill from "../../../ui/components/StatePill/StatePill";
import { MdDateRange } from "react-icons/md";

const TallerCard = (props) => {
  const {
    inscripcion,
    fechas,
    id,
    nombre,
  } = props;

  return (
    <div className="bg-white p-4 flex flex-col gap-4 rounded-lg hover:shadow-lg transition-all duration-300 h-full">
      <Link
        to={`verEvento/${id}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex flex-col w-full">
          <span className="text-lg font-medium text-primary_text_1 truncate tracking-tight leading-tight">
            {nombre}
          </span>
          <span className="text-xs font-light text-primary_gray_2">Microtaller</span>
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

        <div className="grid grid-cols-1 gap-2">
          <StatePill
            hasState={inscripcion}
            stateValue={"Inscripción"}
            icon={"inscripcion"}
          />
        </div>
      </Link>
    </div>
  );
};

export default TallerCard;
