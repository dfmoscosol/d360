import React from "react";
import { MdPerson, MdPhone, MdOutlinePersonSearch, MdSchool, MdClass, MdMenuBook, MdGroup, MdCheckCircle, MdLocationOn, MdAccessTime, MdComment, MdDateRange, MdAccessAlarms } from "react-icons/md";
import { IoMdPodium } from "react-icons/io";
import FormLabel from "../FormLabel/FormLabel";
import ComboBox from "../ComboBox/ComboBox";

const PillPorInscribir = ({ index, title, subTitle, children, data, observadores }) => {
  return (
    <div
      className="border-l-4 border-primary_gray_5 px-4 py-4 flex flex-col w-full hover:shadow-xl transition-all duration-300 cursor-pointer bg-white rounded-lg"
      key={index}
    >
      <div className="flex gap-4 items-center mb-4">
        <div className="flex items-center p-2 bg-primary_gray_1 rounded-full text-primary_gray_4">
          <MdPerson size={25} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-primary_text_1">
            {title}
          </span>
          <span className="text-sm font-normal text-primary_gray_3">
            {subTitle}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 ms-5">
        {data.length !== 0 && <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdAccessTime size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Años de Ejercicio:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.anios_ejercicio}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdPhone size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Número de Celular:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.numero_celular}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdSchool size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Facultad:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.facultad}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdClass size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Carrera:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.carrera}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdMenuBook size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Asignatura:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.asignatura}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <IoMdPodium size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Ciclo de Carrera:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.ciclo_carrera}°</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdGroup size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Número de Estudiantes:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.numero_estudiantes}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdCheckCircle size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Inclusión:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.inclusion ? "Sí" : "No"}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdLocationOn size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Campus:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.campus}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MdAccessAlarms size={20} className="text-primary_gray_4" />
                <span className="text-sm font-medium text-primary_text_1">Duración de la Clase:</span>
              </div>
              <span className="ms-7 text-sm text-primary_gray_3">{data.duracion_clase} minutos</span>
            </div>
            <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <MdComment size={20} className="text-primary_gray_4" />
              <span className="text-sm font-medium text-primary_text_1">Comentarios:</span>
            </div>
            <span className="ms-7 text-sm text-primary_gray_3">{data.comentarios}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <MdDateRange size={20} className="text-primary_gray_4" />
              <span className="text-sm font-medium text-primary_text_1">Horarios Posibles:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 ms-7 ">
              {data.horarios_disponibles.map((horario, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-sm font-medium text-primary_text_1">Día:</span>
                  <span className="text-sm text-primary_gray_3">{horario.dia}</span>
                  <span className="text-sm font-medium text-primary_text_1">Horario:</span>
                  <span className="text-sm text-primary_gray_3">{horario.hora_inicio} - {horario.hora_fin}</span>
                </div>
              ))}
            </div>
          </div>
         
        </>
        }
        {children}

      </div>
    </div>
  );
};


export default PillPorInscribir;
