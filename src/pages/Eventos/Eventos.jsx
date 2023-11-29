import React from "react";

import Card from "./components/Card/Card";
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
    },
  ];

  const { data, error, isLoading, isFetching, isError } =
    useGetAllCapacitacionesQuery();

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  console.log(data);

  return (
    <>
      <div className="py-2 flex items-center justify-between my-2">
        <span className="text-sm font-medium">35 eventos</span>
        <Dropdown
          trigger={
            <button className="bg-primary_color_1 text-primary_color_1_text_light rounded-lg py-2 px-4 flex gap-2 items-center">
              <span className="font-medium">NUEVO</span>
              <MdKeyboardArrowDown size={25} />
            </button>
          }
          dropdownItems={dropdownItems}
        />
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {/**Iterar los datos */}
        {data.respuesta.capacitaciones.map((evento, index) => (
          <div className="col-span-1 h-full flex flex-col" key={index}>
            <Card type={evento.tipo} data={evento} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Eventos;
