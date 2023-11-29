import React from "react";

import { Link } from "react-router-dom";
import { Pill } from "@components";

import {
  MdAccessTimeFilled,
  MdCheckCircle,
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
    <div className="h-full bg-white border border-primary_gray_5 rounded-xl p-4 flex flex-col justify-between gap-4 items-start hover:shadow-lg transition-shadow duration-300">
      <Link
        to={`verEvento/${id_capacitacion}`}
        className="flex flex-col gap-4 w-full justify-between h-full"
      >
        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-1 items-center text-primary_gray_2">
              <GiTeamIdea size={15} />
              <span className="font-normal text-sm">Jornada de Innovación</span>
            </div>
            {allow_inscripcion && (
              <div className="flex items-center justify-center gap-1 rounded-full bg-green-200 py-1 px-2 text-green-700">
                <MdOutlineEmojiPeople size={15} />
                <span className="text-xs font-medium">Inscripciones</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-medium text-primary_color_1">
            {nombre}
          </span>
          {/** 
          <div className="flex gap-2 flex-wrap">
            {fechas.map((fecha, index) => (
              <div
                className="flex items-center gap-1 rounded-xl bg-primary_gray_1 text-primary_color_1 px-2 py-1 mt-2"
                key={index}
              >
                <MdDateRange size={15} />
                <span className="text-xs font-normal">{fecha}</span>
              </div>
            ))}
          </div>
          */}
        </div>
        {/** 
        : (
          
          <div className="flex items-center gap-1 rounded-3xl bg-yellow-200 py-1 px-2">
            <MdBlock size={20} className="text-yellow-700" />
            <span className="text-xs font-medium text-yellow-700">
              Inscripciones Cerradas
            </span>
          </div>
        
        )}*/}
        <div className="flex gap-2 w-full">
          <Pill
            icon={<MdDateRange size={25} />}
            title={"Días"}
            description={fechas.length}
          />
          <Pill
            icon={<GrWorkshop size={25} />}
            title={"Talleres"}
            description={length_talleres}
          />
        </div>
      </Link>
    </div>
  );
};

export default JornadaInnovacionCard;
