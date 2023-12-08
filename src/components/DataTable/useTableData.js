// useTableData.js
import { useState, useMemo, useEffect } from "react";

const useTableData = (initialData, searchColumn) => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10; // Número de filas por página

  // Actualizar la lógica de filtrado para usar la columna de búsqueda dinámica
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item[searchColumn]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm, searchColumn]);

  // Ordenar los datos
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return filteredData.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Obtener datos de la página actual
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, page]);

  // Cambiar el orden de las columnas
  const handleSort = (key) => {
    console.log("handleSort");
    console.log(key);
    setSortKey(key);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Manejar la selección de filas
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) return prev.filter((rowId) => rowId !== id);
      return [...prev, id];
    });
  };

  // Reiniciar la paginación cuando se cambia el término de búsqueda
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return {
    data: paginatedData,
    setSearchTerm,
    handleSort,
    toggleRowSelection,
    selectedRows,
    page,
    setPage,
    totalPages: Math.ceil(sortedData.length / pageSize),
  };
};

export default useTableData;
