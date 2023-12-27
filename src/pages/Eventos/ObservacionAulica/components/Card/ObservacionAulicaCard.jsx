import React from "react";

import { Link } from "react-router-dom";
import { InfoPill } from "@components";
import StatePill from "../../../ui/components/StatePill/StatePill";

const ObservacionAulicaCard = (props) => {
  const { allow_inscripcion, fechas, id_capacitacion, nombre } = props;

  return (
    <div className="bg-white p-4 flex flex-col gap-4 rounded-lg hover:shadow-lg transition-all duration-300 h-full">
      <Link
        to={`verEvento/${id_capacitacion}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex gap-2 items-center">
          <div className="flex flex-col">
            <span className="text-base font-medium text-primary_color_1">
              {nombre}
            </span>
            <div className="flex gap-2">
              {fechas.map((fecha, index) => (
                <div key={index} className="bg-primary_gray_1 rounded-lg px-2">
                  <span className="text-xs font-normal text-primary_gray_4">
                    {fecha}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatePill
            hasState={allow_inscripcion}
            stateValue={"Inscripción"}
            icon={"inscripcion"}
          />
        </div>
        <div className="flex">
          <InfoPill
            icon={"observacion"}
            size="small"
            type="date"
            isRadial={false}
            isSquare={false}
            value={"Observación Áulica"}
          />
        </div>
      </Link>
    </div>
  );
};

export default ObservacionAulicaCard;
