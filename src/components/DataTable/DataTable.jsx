// DataTable.js
import React from "react";
import useTableData from "./useTableData";
import { MdOutlineSearch } from "react-icons/md";
import { Button } from "@components";

const DataTable = ({
  initialData,
  idColumn,
  searchColumn,
  columnMappings,
  columnOrder,
  selectedRows,
  toggleRowSelection,
}) => {
  const {
    data,
    setSearchTerm,
    handleSort,
    //toggleRowSelection,
    //selectedRows,
    page,
    setPage,
    totalPages,
  } = useTableData(initialData, searchColumn);

  //let columns = Object.keys(initialData[0]).filter((col) => col !== idColumn);

  // Usar el mapeo y el orden de las columnas
  const columns = columnOrder.map((key) => ({
    key,
    label: columnMappings[key] || key,
  }));

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center justify-end">
        <div className="bg-primary_gray_1 flex gap-1 py-2 px-4 rounded-2xl items-center">
          <MdOutlineSearch size={23} className="text-primary_gray_4" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm bg-primary_gray_1 border-none outline-none"
          />
        </div>
      </div>

      <table className="border-collapse md:table mt-5 table-auto">
        <thead className="bg-primary_gray_1">
          <tr className="rounded-lg">
            <th className="p-2">
              {/** 
              <input type="checkbox" />*/}
            </th>
            {columns.map(({ key, label }) => (
              <th key={key}>
                <button
                  className="font-medium text-sm text-primary_text_1 p-2"
                  onClick={() => handleSort(key)}
                >
                  {label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item[idColumn]}
              className={` transition-all duration-200 ${
                selectedRows.includes(item[idColumn])
                  ? "bg-primary_gray_5"
                  : "bg-white hover:bg-primary_gray_5"
              }`}
            >
              <td className="px-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item[idColumn])}
                  onChange={() => toggleRowSelection(item.id)}
                  className="cursor-pointer"
                />
              </td>
              {columns.map(({ key }) => (
                <td
                  key={key}
                  className="text-sm font-normal text-primary_gray_4 px-2"
                >
                  {item[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6 bg-primary_gray_1 rounded-lg p-2">
        <Button
          value="Anterior"
          type="gray"
          size="small"
          icon="left"
          onClick={() => setPage(page - 1)}
          extra="px-2"
          isDisabled={page === 1}
        />
        <span className="text-sm font-medium text-primary_text_1">
          Página {page} de {totalPages}
        </span>
        <Button
          value="Siguiente"
          type="gray"
          size="small"
          icon="right"
          onClick={() => setPage(page + 1)}
          extra="px-2"
          isDisabled={page === totalPages}
        />
      </div>
    </div>
  );
};

export default DataTable;
