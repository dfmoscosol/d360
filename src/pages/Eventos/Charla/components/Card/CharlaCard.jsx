import React from "react";

import { Link } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import StatePill from "../../../ui/components/StatePill/StatePill";

const CharlaCard = (props) => {
  const {
    allow_asistencia_entrada,
    allow_asistencia_salida,
    allow_inscripcion,
    fechas,
    id_capacitacion,
    nombre,
  } = props;

  return (
    <div className="bg-white p-4 flex flex-col gap-4 rounded-lg hover:shadow-lg transition-all duration-300 h-full">
      <Link
        to={`verEvento/${id_capacitacion}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex flex-col w-full">
          <span className="text-lg font-medium text-primary_text_1 truncate tracking-tight">
            {nombre}
          </span>
          <span className="text-xs font-light text-primary_gray_2">
            Charla
          </span>
        </div>

        <div className="flex gap-2">
          {fechas.map((fecha, index) => (
            <div
              key={index}
              className="bg-primary_gray_1 rounded-lg p-2 flex gap-1 text-primary_gray_4 items-center"
            >
              <MdDateRange size={15} />
              <span className="text-xs font-normal tracking-tight">
                {fecha}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatePill
            hasState={allow_inscripcion}
            stateValue={"Inscripción"}
            icon={"inscripcion"}
          />
          <StatePill
            hasState={allow_asistencia_entrada}
            stateValue={"Entrada"}
            icon={"entrada"}
          />
          <StatePill
            hasState={allow_asistencia_salida}
            stateValue={"Salida"}
            icon={"salida"}
          />
        </div>
      </Link>
    </div>
  );
};

export default CharlaCard;
