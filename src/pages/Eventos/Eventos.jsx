import React from "react";

import Card from "./ui/components/Card/Card";
import { Dropdown, Loader, FetchError } from "@components";
import { MdKeyboardArrowDown } from "react-icons/md";

import { GrWorkshop } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamIdea } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";

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

  return (
    <div className="pb-12">
      <div className="py-2 flex items-center justify-between my-2">
        <span className="text-sm font-medium">
          {capacitaciones.length} eventos
        </span>
        <Dropdown
          trigger={
            <button className="bg-primary_color_1 text-primary_color_1_text_light rounded-lg py-2 px-4 flex gap-2 items-center hover:bg-primary_color_1_bg_light active:bg-primary_color_1  transition duration-200">
              <span className="font-medium">NUEVO</span>
              <MdKeyboardArrowDown size={25} />
            </button>
          }
          dropdownItems={dropdownItems}
        />
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {/**Iterar los datos */}
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
