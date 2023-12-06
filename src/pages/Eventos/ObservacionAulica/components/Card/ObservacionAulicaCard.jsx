import React from "react";

import { Link } from "react-router-dom";
import { InfoPill } from "@components";

import { SiGoogleclassroom } from "react-icons/si";

const ObservacionAulicaCard = (props) => {
  const { allow_inscripcion, id_capacitacion, nombre, fechas, horas, cupo } =
    props;

  return (
    <div className="h-full bg-white rounded-lg p-4 flex flex-col justify-between gap-4 items-start hover:shadow-lg transition-all duration-200">
      <Link
        to={`verEvento/${id_capacitacion}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-lg font-medium text-primary_color_1">
              {nombre}
            </span>
            <span className="font-normal text-xs text-primary_gray_2">
              Observación Áulica
            </span>
          </div>
          <div className="p-2 bg-primary_gray_1 text-primary_gray_4 rounded-lg flex items-center ">
            {" "}
            {/** bg-teal-100 text-teal-600*/}
            <SiGoogleclassroom size={23} />
          </div>
        </div>
        <div className="flex flex-col items-start">
          {allow_inscripcion ? (
            <InfoPill
              value="Inscripciones"
              size="small"
              type="success"
              icon="inscripciones"
            />
          ) : (
            <InfoPill
              value="Inscripciones"
              size="small"
              type="warning"
              icon="close"
            />
          )}
        </div>
        <div className="flex flex-col border-l-4 pl-2 border-teal-100">
          <span className="text-primary_gray_2 font-normal text-xs">
            Fechas
          </span>
          <span className="flex text-sm text-primary_gray_4 font-medium gap-2">
            {fechas.map((fecha, index) => (
              <span
                key={index}
                className="bg-primary_gray_1 px-3 py-1 rounded-lg"
              >
                {fecha}
              </span>
            ))}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ObservacionAulicaCard;
