import React from "react";

import { Link } from "react-router-dom";
import { Pill } from "@components";

import {
  MdAccessTimeFilled,
  MdCheckCircle,
  MdOutlineEmojiPeople,
  MdSupervisorAccount,
} from "react-icons/md";

import { SiGoogleclassroom } from "react-icons/si";

const ObservacionAulicaCard = (props) => {
  const {
    allow_inscripcion,
    id_capacitacion,
    nombre,
    fecha_inicio,
    horas,
    cupo,
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
              <SiGoogleclassroom size={15} />
              <span className="font-medium text-sm">Observación Áulica</span>
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
          <div className="flex gap-2 items-center">
            <span className="text-sm font-normal text-primary_gray_3">
              Inicia el {fecha_inicio}
            </span>
          </div>
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
            icon={<MdAccessTimeFilled size={25} />}
            title={"Horas"}
            description={horas}
          />
          <Pill
            icon={<MdSupervisorAccount size={25} />}
            title={"Cupo"}
            description={cupo}
          />
        </div>
      </Link>
    </div>
  );
};

export default ObservacionAulicaCard;
