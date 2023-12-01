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
    <div className="h-full bg-white rounded-lg p-4 flex flex-col justify-between gap-4 items-start hover:shadow-lg transition-shadow duration-300">
      <Link
        to={`verEvento/${id_capacitacion}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex gap-2 items-start">
          <div className="p-2 bg-blue-100 text-blue-900 rounded-lg flex items-center ">
            <GrWorkshop size={28} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-medium text-primary_color_1">
              {nombre}
            </span>
            <span className="font-normal text-xs text-primary_gray_2">
              Charla
            </span>
            {/**allow_inscripcion && (
              <div className="flex items-center justify-center gap-1 rounded-lg bg-green-200 py-1 px-2 text-green-700">
                <MdOutlineEmojiPeople size={20} />
              </div>
            )*/}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-primary_gray_2 font-normal text-xs ">
            Tutor
          </span>
          <span className="text-sm text-primary_gray_4 font-medium">
            {nombre_tutor}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-primary_gray_2 font-normal text-xs ">
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
