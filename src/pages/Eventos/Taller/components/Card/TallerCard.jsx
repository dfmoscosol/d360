import React from "react";

import { Link } from "react-router-dom";
import { Pill } from "@components";

import {
  MdAccessTimeFilled,
  MdCheckCircle,
  MdDateRange,
  MdOutlineEmojiPeople,
  MdSupervisorAccount,
  MdClose,
} from "react-icons/md";

import { FaChalkboardTeacher } from "react-icons/fa";

import { GiTeamIdea } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";

const TallerCard = (props) => {
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
              Taller
            </span>
          </div>
          <div className="p-2 bg-primary_gray_1 text-primary_gray_4 rounded-lg flex items-center ">
            {" "}
            {/**bg-rose-100 text-rose-600 */}
            <FaChalkboardTeacher size={23} />
          </div>
        </div>
        <div className="flex flex-col items-start">
          {allow_inscripcion ? (
            <div className="flex items-center gap-1 bg-green-200 py-1 px-2 text-green-700 rounded-xl text-xs font-medium">
              <MdCheckCircle size={18} />
              <span className="">Inscripciones</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-red-200 py-1 px-2 text-red-700 rounded-xl text-xs font-medium">
              <MdClose size={18} />
              <span className="">Inscripciones</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full">
          <Pill
            icon={<MdDateRange size={20} />}
            title={"Días"}
            description={fechas.length}
            type={4}
          />
          <Pill
            icon={<MdSupervisorAccount size={20} />}
            title={"Cupos"}
            description={cupo}
            type={4}
          />
        </div>
      </Link>
    </div>
  );
};

export default TallerCard;
