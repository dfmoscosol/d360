import React, { useState } from "react";

import Card from "./ui/components/Card/Card";
import { Loader, FetchError } from "@components";
import { Link } from "react-router-dom";

import { MdAdd } from "react-icons/md";

import { useGetAllEventosQuery } from "@redux/services/evento/eventoApi";
import FilterSelect from "./ui/components/FilterSelect/FilterSelect"; // Asegúrate de importar correctamente

const Eventos = () => {
  const { data, error, isLoading, isFetching, isError } =
    useGetAllEventosQuery();

  const [tipoEventoFiltro, setTipoEventoFiltro] = useState("Todos los eventos");
  const [inscripcionFiltro, setInscripcionFiltro] = useState("Inscripciones");

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const eventos = data.respuesta.eventos;

  // Opciones para los filtros
  const opcionesTipoEvento = [
    "Todos los eventos",
    "Jornada de Innovación",
    "Charla",
    "Microtaller",
    "Observación Áulica",
  ];

  const opcionesInscripcion = ["Inscripciones", "Abiertas", "Cerradas"];

  // Filtrar los eventos según los filtros seleccionados
  const eventosFiltrados = eventos.filter((evento) => {
    // Mapear evento.tipo a su etiqueta correspondiente
    let tipoEventoLabel = "Desconocido";
    if (evento.tipo === 1) tipoEventoLabel = "Jornada de Innovación";
    else if (evento.tipo === 2) tipoEventoLabel = "Charla";
    else if (evento.tipo === 3) tipoEventoLabel = "Microtaller";
    else if (evento.tipo === 4) tipoEventoLabel = "Observación Áulica";

    const filtroTipoEvento =
      tipoEventoFiltro === "Todos los eventos" || tipoEventoLabel === tipoEventoFiltro;

    const filtroInscripcion =
      inscripcionFiltro === "Inscripciones" ||
      (inscripcionFiltro === "Abiertas" && evento.inscripcion) ||
      (inscripcionFiltro === "Cerradas" && !evento.inscripcion);

    return filtroTipoEvento && filtroInscripcion;
  });

  return (
    <div className="pb-12">
      {/* Filtros */}
      <div className="mb-4 flex justify-end w-full">
        <div className="flex space-x-4">
          <div className="w-58">
            <FilterSelect
              items={opcionesTipoEvento}
              selected={tipoEventoFiltro}
              onSelect={(item) => setTipoEventoFiltro(item)}
              isEnabled={true}
              enableEdit={false}
            />
          </div>
          <div className="w-40">
            <FilterSelect
              items={opcionesInscripcion}
              selected={inscripcionFiltro}
              onSelect={(item) => setInscripcionFiltro(item)}
              isEnabled={true}
              enableEdit={false}
            />
          </div>
        </div>
      </div>
      <div className="mb-4 flex justify-end w-full">
        <span className="text-sm font-medium text-primary_text_1">
          {eventosFiltrados.length} eventos
        </span>
      </div>
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to={"/eventos/nuevoEvento"} className="w-full col-span-1">
          <div className="p-4 gap-4 h-full flex flex-col items-center justify-center border rounded-lg border-primary_gray_5 hover:shadow-lg transition-all duration-200">
            <div className="bg-gray-100 rounded-full p-1 text-primary_gray_4">
              <MdAdd size={50} />
            </div>
            <span className="text-base font-medium text-primary_gray_4">
              Nuevo Evento
            </span>
          </div>
        </Link>
        {eventosFiltrados.map((evento, index) => (
          <div className="col-span-1 h-full flex flex-col" key={index}>
            <Card type={evento.tipo} data={evento} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventos;

