import React from "react";

import { Link } from "react-router-dom";

import { InfoPill, HorizontalPill } from "@components";

const CharlaCard = (props) => {
  const {
    allow_asistencia,
    allow_inscripcion,
    cupo,
    direccion,
    fechas,
    horas,
    id_capacitacion,
    nombre,
    nombre_tutor,
    isPresencial,
  } = props;

  let modalidad = "";
  if (isPresencial) {
    modalidad = "Presencial";
  } else {
    modalidad = "Virtual";
  }

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
              Charla
            </span>
          </div>
          <InfoPill
            icon={"charla"}
            size={"medium"}
            type={"date"}
            isRadial={true}
          />
        </div>
        <HorizontalPill title={"Tutor"} subTitle={nombre_tutor} />
        <HorizontalPill title={"Modalidad"} subTitle={modalidad} />
      </Link>
    </div>
  );
};

export default CharlaCard;
