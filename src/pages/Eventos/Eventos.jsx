import React from "react";

import Card from "./ui/components/Card/Card";
import { Dropdown, Loader, FetchError } from "@components";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";

import { GrWorkshop } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamIdea } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";

import { MdAdd } from "react-icons/md";

import { useGetAllCapacitacionesQuery } from "@redux/services/evento/eventoApi";

const Eventos = () => {
  /**
   * PARA EL DROPDOWN MENU
   */
  const dropdownItems = [
    {
      to: "nuevoEvento/jornadaInnovacion",
      label: "Jornada de Innovación",
      icon: <GiTeamIdea size={20} />,
      colors: "bg-amber-100 text-amber-900",
    },
    {
      to: "nuevoEvento/charla",
      label: "Charla",
      icon: <GrWorkshop size={20} />,
      colors: "bg-blue-100 text-blue-900",
    },
    {
      to: "nuevoEvento/taller",
      label: "Taller",
      icon: <FaChalkboardTeacher size={20} />,
      colors: "bg-rose-100 text-rose-900",
    },
    {
      to: "nuevoEvento/observacionAulica",
      label: "Observación Áulica",
      icon: <SiGoogleclassroom size={20} />,
      colors: "bg-teal-100 text-teal-900",
    },
  ];

  const { data, error, isLoading, isFetching, isError } =
    useGetAllCapacitacionesQuery();

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const capacitaciones = data.respuesta.capacitaciones;

  console.log(capacitaciones);

  return (
    <div className="pb-12">
      <div className="py-2 flex items-center justify-end">
        {/** 
        <Dropdown
          trigger={
            <button className="bg-primary_color_1 text-primary_color_1_text_light rounded-lg py-2 px-4 flex gap-2 items-center hover:bg-primary_color_1_bg_light active:bg-primary_color_1  transition duration-200">
              <span className="font-medium">NUEVO</span>
              <MdKeyboardArrowDown size={25} />
            </button>
          }
          dropdownItems={dropdownItems}
        />
        */}
        <span className="text-sm font-medium">
          {capacitaciones.length} eventos
        </span>
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {/**Iterar los datos */}
        <Link to={"/eventos/nuevoEvento"}>
          <div className="col-span-1 p-4 gap-4 h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-primary_gray_5 hover:shadow-lg transition-all duration-200">
            <div className="bg-primary_gray_5 rounded-full p-1 text-primary_gray_4">
              <MdAdd size={50} />
            </div>
            <span className="text-base font-medium text-primary_gray_4">
              Nuevo Evento
            </span>
          </div>
        </Link>
        {capacitaciones.map((evento, index) => (
          <div className="col-span-1 h-full flex flex-col" key={index}>
            <Card type={evento.tipo} data={evento} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventos;
