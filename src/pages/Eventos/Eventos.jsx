import React from "react";

import Card from "./ui/components/Card/Card";
import { Loader, FetchError } from "@components";
import { Link } from "react-router-dom";

import { MdAdd } from "react-icons/md";

import { useGetAllEventosQuery } from "@redux/services/evento/eventoApi";

const Eventos = () => {
   const { data, error, isLoading, isFetching, isError } =
    useGetAllEventosQuery();

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const eventos = data.respuesta.eventos; 

  return (
    <div className="pb-12">
      <div className="py-2 flex items-center justify-end">
        <span className="text-sm font-medium text-primary_text_1">
           {eventos.length} eventos
        </span>
      </div>
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to={"/eventos/nuevoEvento"} className="w-full col-span-1">
          <div className=" p-4 gap-4 h-full flex flex-col items-center justify-center border rounded-lg border-primary_gray_5 hover:shadow-lg transition-all duration-200">
            <div className="bg-gray-100 rounded-full p-1 text-primary_gray_4">
              <MdAdd size={50} />
            </div>
            <span className="text-base font-medium text-primary_gray_4">
              Nuevo Evento
            </span>
          </div>
        </Link>
         {eventos.map((evento, index) => (
          <div className="col-span-1 h-full flex flex-col" key={index}>
            <Card type={evento.tipo} data={evento} />
          </div>
        ))} 
      </div>
    </div>
  );
};

export default Eventos;
