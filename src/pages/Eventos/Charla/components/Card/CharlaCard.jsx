import React from "react";

import { Link } from "react-router-dom";
import { Pill } from "@components";

import {
  MdAccessTimeFilled,
  MdCheckCircle,
  MdDateRange,
  MdOutlineEmojiPeople,
  MdSupervisorAccount,
  MdOutlinePerson,
} from "react-icons/md";

import { GiTeamIdea } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";

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
          <div className="p-2 bg-primary_gray_1 text-primary_gray_4  rounded-lg flex items-center "> {/**bg-blue-100 text-blue-600 */}
            <GrWorkshop size={23} />
          </div>
        </div>
        <div className="flex flex-col border-l-4 pl-2 border-blue-100">
          <span className="text-primary_gray_2 font-normal text-xs">
            Tutor
          </span>
          <span className="text-sm text-primary_gray_4 font-medium">
            {nombre_tutor}
          </span>
        </div>
        <div className="flex flex-col border-l-4 pl-2 border-blue-100">
          <span className="text-primary_gray_2 font-normal text-xs">
            Modalidad
          </span>
          <span className="text-sm text-primary_gray_4 font-medium">
            {modalidad}
          </span>
        </div>
        {/** 
        <div className="flex gap-2 w-full ">
          <Pill
            icon={<MdDateRange size={20} />}
            title={"Días"}
            description={fechas.length}
            type={3}
          />
          <Pill
            icon={<MdSupervisorAccount size={20} />}
            title={"cupo"}
            description={cupo}
            type={3}
          />
        </div>
        */}
      </Link>
    </div>
  );
};

export default CharlaCard;
