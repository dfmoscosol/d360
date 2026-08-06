import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";

import Card from "./ui/components/Card/Card";
import { Loader, FetchError } from "@components";
import { useGetAllEventosQuery } from "@redux/services/evento/eventoApi";
import FilterSelect from "./ui/components/FilterSelect/FilterSelect";

import SearchBar from "./ui/components/SearchBar/SearchBar";
import StatusTabs from "./ui/components/StatusTabs/StatusTabs";
import Pagination from "./ui/components/Pagination/Pagination";

// Utility to parse dd-mm-yyyy dates
const parseDateString = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  return new Date(dateStr); // fallback
};

const getEventStatus = (fechas) => {
  if (!fechas || fechas.length === 0) return 'Finalizados';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateObjects = fechas.map(f => parseDateString(f.fecha));
  const minDate = new Date(Math.min(...dateObjects));
  const maxDate = new Date(Math.max(...dateObjects));

  if (minDate > today) return 'Próximos';
  if (maxDate < today) return 'Finalizados';
  return 'En Curso';
};

const getLatestDate = (fechas) => {
  if (!fechas || fechas.length === 0) return new Date(0);
  const dateObjects = fechas.map(f => parseDateString(f.fecha));
  return new Date(Math.max(...dateObjects));
};

const Eventos = () => {
  const { data, error, isLoading, isFetching, isError } = useGetAllEventosQuery();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [tipoEventoFiltro, setTipoEventoFiltro] = useState("Todos los eventos");
  const [inscripcionFiltro, setInscripcionFiltro] = useState("Inscripciones");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(18);

  if (isLoading || isFetching) return <Loader />;
  if (isError) return <FetchError error={error} />;

  const eventosRaw = data?.respuesta?.eventos || [];

  // Options
  const opcionesTipoEvento = [
    "Todos los eventos",
    "Jornada de Innovación",
    "Charla",
    "Microtaller",
    "Observación Áulica",
  ];
  const opcionesInscripcion = ["Inscripciones", "Abiertas", "Cerradas"];

  // 1. Map events with calculated properties
  const eventosEnhanced = eventosRaw.map(evento => ({
    ...evento,
    computedStatus: getEventStatus(evento.fechas),
    latestDate: getLatestDate(evento.fechas),
    tipoEventoLabel: evento.tipo === 1 ? "Jornada de Innovación" : 
                     evento.tipo === 2 ? "Charla" : 
                     evento.tipo === 3 ? "Microtaller" : 
                     evento.tipo === 4 ? "Observación Áulica" : "Desconocido"
  }));

  // 2. Filter events
  const eventosFiltrados = eventosEnhanced.filter((evento) => {
    // Search
    const searchMatch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status (temporal)
    const statusMatch = statusFiltro === "Todos" || evento.computedStatus === statusFiltro;
    
    // Type
    const typeMatch = tipoEventoFiltro === "Todos los eventos" || evento.tipoEventoLabel === tipoEventoFiltro;
    
    // Registration
    const inscripcionMatch = inscripcionFiltro === "Inscripciones" ||
      (inscripcionFiltro === "Abiertas" && evento.inscripcion) ||
      (inscripcionFiltro === "Cerradas" && !evento.inscripcion);

    return searchMatch && statusMatch && typeMatch && inscripcionMatch;
  });

  // 3. Sort events (descending by latest date)
  const eventosSorted = [...eventosFiltrados].sort((a, b) => b.latestDate - a.latestDate);

  // 4. Paginate
  const totalItems = eventosSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Ensure current page is valid after filtering
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedEvents = eventosSorted.slice(startIndex, startIndex + itemsPerPage);

  // Status Tab Counts
  const statusCounts = {
    "Todos": eventosEnhanced.length,
    "Próximos": eventosEnhanced.filter(e => e.computedStatus === "Próximos").length,
    "En Curso": eventosEnhanced.filter(e => e.computedStatus === "En Curso").length,
    "Finalizados": eventosEnhanced.filter(e => e.computedStatus === "Finalizados").length,
  };

  const statusOptions = [
    { id: "Todos", label: "Todos", count: statusCounts["Todos"] },
    { id: "Próximos", label: "Próximos", count: statusCounts["Próximos"] },
    { id: "En Curso", label: "En Curso", count: statusCounts["En Curso"] },
    { id: "Finalizados", label: "Finalizados", count: statusCounts["Finalizados"] },
  ];

  const handleStatusChange = (status) => {
    setStatusFiltro(status);
    setCurrentPage(1); // Reset page on filter change
  };

  return (
    <div className="pb-12 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
            placeholder="Buscar evento..." 
          />
          <Link 
            to={"/eventos/nuevoEvento"} 
            className="flex items-center gap-2 bg-primary_color_1 hover:bg-primary_color_1/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center"
          >
            <MdAdd size={20} />
            <span>Nuevo Evento</span>
          </Link>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-200 pb-4">
        <StatusTabs 
          options={statusOptions} 
          selected={statusFiltro} 
          onSelect={handleStatusChange} 
        />
        
        <div className="flex space-x-4 w-full lg:w-auto">
          <div className="w-48">
            <FilterSelect
              items={opcionesTipoEvento}
              selected={tipoEventoFiltro}
              onSelect={(item) => { setTipoEventoFiltro(item); setCurrentPage(1); }}
              isEnabled={true}
              enableEdit={false}
            />
          </div>
          <div className="w-40">
            <FilterSelect
              items={opcionesInscripcion}
              selected={inscripcionFiltro}
              onSelect={(item) => { setInscripcionFiltro(item); setCurrentPage(1); }}
              isEnabled={true}
              enableEdit={false}
            />
          </div>
        </div>
      </div>

      {/* SUMMARY STRIP */}
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
        <span className="text-sm font-medium text-gray-700">
          <span className="font-bold text-primary_color_1">{totalItems}</span> eventos encontrados
        </span>
        <span className="text-sm text-gray-500 hidden sm:block">
          Orden: Más recientes primero
        </span>
      </div>

      {/* MAIN GRID */}
      {paginatedEvents.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((evento) => (
            <div className="col-span-1 h-full" key={evento.id}>
              <Card type={evento.tipo} data={evento} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-gray-400 mb-2">No se encontraron eventos con los filtros actuales</span>
          <button 
            onClick={() => {
              setSearchTerm("");
              setStatusFiltro("Todos");
              setTipoEventoFiltro("Todos los eventos");
              setInscripcionFiltro("Inscripciones");
            }}
            className="text-primary_color_1 font-medium hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={validCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
          totalItems={totalItems}
        />
      )}
      
    </div>
  );
};

export default Eventos;
