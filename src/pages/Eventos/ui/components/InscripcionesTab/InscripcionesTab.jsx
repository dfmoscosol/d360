import React from "react";
import { DataTable } from "@components";

import { Loader, FetchError } from "@components";
import { useGetAllDocentesQuery } from "../../../../../redux/services/docente/docenteApi";

const InscripcionesTab = ({ id }) => {
  const { data, error, isLoading, isFetching, isError } =
    useGetAllDocentesQuery({ value: id });

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const docentes = data.respuesta;

  const columnMappings = {
    nombre: "Nombres",
    correo: "Correo Institucional",
  };

  const columnOrder = ["nombre", "correo"];

  return (
    <div className="">
      <DataTable
        initialData={docentes}
        idColumn={"id"}
        searchColumn={"nombre"}
        columnMappings={columnMappings}
        columnOrder={columnOrder}
      />
    </div>
  );
};

export default InscripcionesTab;
