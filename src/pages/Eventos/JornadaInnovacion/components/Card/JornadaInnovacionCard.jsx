import React from "react";

import { Link } from "react-router-dom";
import { Pill } from "@components";

import {
  MdAccessTimeFilled,
  MdCheckCircle,
  MdClose,
  MdDateRange,
  MdOutlineEmojiPeople,
} from "react-icons/md";

import { GiTeamIdea } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";

const JornadaInnovacionCard = (props) => {
  const {
    id_capacitacion,
    nombre,
    allow_inscripcion,
    horas,
    length_talleres,
    fechas,
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
              Jornada de Innovación
            </span>
          </div>
          <div className="p-2 bg-primary_gray_1 text-primary_gray_4 rounded-lg flex items-center "> {/**bg-amber-100 text-amber-600 */}
            <GiTeamIdea size={23} />
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
            type={1}
          />
          <Pill
            icon={<GrWorkshop size={20} />}
            title={"Talleres"}
            description={length_talleres}
            type={1}
          />
        </div>
      </Link>
    </div>
  );
};

export default JornadaInnovacionCard;
