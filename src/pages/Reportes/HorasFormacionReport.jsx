import React from 'react';
import { useGetAllFacultadesQuery, useGetDocenteReportMutation, useGetDocentesHorasExcelMutation, useGetDocentesHorasQuery } from '../../redux/services/reportes/reportesApi';
import { Button, Loader } from "@components";
import Select from "react-select";
import { customStyles } from "../Eventos/ui/components/EventoView/EventoView";
import { RiFileExcel2Line } from "react-icons/ri";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { MdCloudUpload } from "react-icons/md";
import DetalleDocenteModal from '../Reportes/HorasDetailModal';
import CargaMasivaGraduadosModal from './CargaMasivaGraduadosModal';
import { BiLoaderCircle } from "react-icons/bi";

const ReportesDocentes = () => {
    // Estados locales para filtros
    const [busqueda, setBusqueda] = React.useState('');
    const [facultad, setFacultad] = React.useState('Todas');
    const [horas, setHoras] = React.useState(0);

    // Estado para la modal
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isCargaMasivaOpen, setIsCargaMasivaOpen] = React.useState(false);
    const [docenteDetalle, setDocenteDetalle] = React.useState(null);

    // Paginación (opcional)
    const [page, setPage] = React.useState(1);
    const per_page = 10;

    // Construimos el objeto de parámetros para la query
    const queryParams = {
        busqueda: busqueda !== '' ? busqueda : undefined,
        facultad: facultad.label !== 'Todas' ? facultad.label : undefined,
        horas_min: horas,
        page,
        per_page,
    };

    // Hook de RTK Query para traer los datos
    const { data, error, isLoading, isFetching } = useGetDocentesHorasQuery(queryParams);
    const { data: dataFacultades, isLoading: isLoadingFacultades, error: errorFacultades } = useGetAllFacultadesQuery();
    const [getDocenteReport, { isLoading: isLoadingDetalle }] = useGetDocenteReportMutation();
    const [getDocentesHorasExcel, { isLoading: isDownloadingExcel }] = useGetDocentesHorasExcelMutation();

    const handleExportExcel = async () => {
        try {
            // Llama al endpoint con los mismos filtros (o distintos si quieres).
            // Nota: este ejemplo asume que tu ruta de Flask "excel_todo" no usa paginación.
            const blob = await getDocentesHorasExcel({
                busqueda: busqueda !== "" ? busqueda : undefined,
                facultad: facultad.label !== "Todas" ? facultad.label : undefined,
                horas_min: horas,
            }).unwrap();

            // Crear URL para el blob
            const url = window.URL.createObjectURL(blob);
            // Crear un link "invisible" para forzar la descarga
            const link = document.createElement("a");
            link.href = url;
            link.download = "reporte_docentes_horas.xlsx"; // Nombre para el archivo
            document.body.appendChild(link);
            link.click();

            // Limpieza
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar Excel:", error);
        }
    };

    const handleRowClick = async (uidFirebase, horas) => {
        if (horas > 0) {

            try {
                const resp = await getDocenteReport(uidFirebase).unwrap();
                setDocenteDetalle(resp.respuesta);
                setIsModalOpen(true);
            } catch (err) {
                console.error("Error al obtener detalle del docente:", err);
            }
        }
    };

    // Datos del backend
    const opcionesFacultades = [
        { value: 'todas', label: 'Todas' },  // Opción adicional al inicio
        ...(dataFacultades?.respuesta?.facultades.map((facultad) => ({
            value: facultad.id_facultad,
            label: facultad.nombre,
        })) || [])
    ];

    const docentes = data?.respuesta || [];
    const totalResultados = data?.paginacion?.total_resultados || 0;
    const paginaActual = data?.paginacion?.pagina_actual || 1;
    const totalPaginas = data?.paginacion?.total_paginas || 1;

    return (
        <div className="px-5">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4  md:space-y-0 md:space-x-4">
                {/* Busqueda */}
                <input
                    type="text"
                    placeholder="Buscar por nombre o correo"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-lg py-[10px] px-4 text-gray-700 focus:outline-none text-sm"
                />

                {/* Select de facultades con los mismos estilos */}
                <Select
                    options={opcionesFacultades}
                    value={facultad}
                    onChange={setFacultad}
                    placeholder="Seleccionar Facultad"
                    className="w-full"
                    styles={customStyles}
                    isLoading={isLoadingFacultades}
                />


                {/* Filtro de horas */}
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <span className="whitespace-nowrap">Horas: {horas}</span>
                    <input
                        type="range"
                        min="0"
                        max="140"
                        value={horas}
                        onChange={(e) => setHoras(parseInt(e.target.value))}
                        className="w-full md:w-32 accent-gray-500"
                    />
                </div>

                {/* Botones de acción */}
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <button
                        onClick={() => setIsCargaMasivaOpen(true)}
                        className="flex items-center space-x-2 border border-gray-300 bg-white rounded-lg px-4 py-2 hover:bg-gray-100"
                    >
                        <MdCloudUpload className="text-gray-700" />
                        <span className="text-gray-700">Carga Masiva</span>
                    </button>
                    
                    {/* Botón Exportar */}
                    <button
                        onClick={handleExportExcel}
                        disabled={isDownloadingExcel}
                        className={`flex items-center space-x-2 border border-gray-300 bg-white rounded-lg px-4 py-2 
                    ${isDownloadingExcel ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`}
                    >
                        {isDownloadingExcel ? (
                            <BiLoaderCircle  className="animate-spin text-gray-700" />
                        ) : (
                            <RiFileExcel2Line />
                        )}
                        <span className="text-gray-700">{isDownloadingExcel ? "Descargando..." : "Descargar"}</span>
                    </button>
                </div>
            </div>

            {/* Tabla de resultados */}
            <div className="mb-4 flex justify-end w-full">
                <span className="text-sm font-medium text-primary_text_1">
                    {totalResultados} resultados
                </span>
            </div>
            <div className="flex flex-col rounded-lg p-4 border border-primary_gray_5 mt-4 bg-white">
                {isLoading || (isFetching && !isLoading) ?
                    (
                        <Loader />
                    ) : (
                        <>
                            <div className="w-full flex flex-col">
                                <table className="border-collapse md:table table-auto">
                                    <thead className="bg-primary_gray_1 rounded-lg">
                                        <tr className="">
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Correo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Facultad</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-center">Horas de Formación</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Graduado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {docentes.map((doc, i) => (
                                            <tr
                                                key={i}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleRowClick(doc.docente.uid_firebase, doc.horas_acreditadas.total)}
                                            >
                                                <td className="p-2 text-sm text-gray-800">
                                                    {doc.docente.nombre}
                                                </td>
                                                <td className="p-2 text-sm text-gray-600">
                                                    {doc.docente.correo}
                                                </td>
                                                <td className="p-2 text-sm text-gray-600">
                                                    {doc.facultades.join(", ")}
                                                </td>
                                                <td className="p-2 text-sm text-gray-600 text-center">
                                                    {doc.horas_acreditadas.total}
                                                </td>
                                                <td className="p-2 text-sm text-center">
                                                  {doc.docente.graduado ? (
                                                    <HiCheckCircle className="text-green-600 mx-auto" />
                                                  ) : (
                                                    <HiXCircle className="text-red-500 mx-auto" />
                                                  )}
                                                </td>
                                            </tr>
                                        ))}
                                        {docentes.length === 0 && !isLoading && !error && (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                                    No results found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                {/* Paginación (si el backend proporciona estos datos) */}
                                <div className="flex justify-between items-center mt-6 bg-primary_gray_1 rounded-lg p-2">
                                    <Button
                                        value="Anterior"
                                        type="gray"
                                        size="small"
                                        icon="left"
                                        onClick={() => setPage(p => p - 1)}
                                        extra="px-2"
                                        isDisabled={paginaActual <= 1}
                                    />
                                    <span className="text-sm font-medium text-primary_text_1">
                                        Página {paginaActual} de {totalPaginas}
                                    </span>
                                    <Button
                                        value="Siguiente"
                                        type="gray"
                                        size="small"
                                        icon="right"
                                        onClick={() => setPage(p => p + 1)}
                                        extra="px-2"
                                        isDisabled={paginaActual >= totalPaginas}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
            <DetalleDocenteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isLoading={isLoadingDetalle}
                data={docenteDetalle}
            />
            
            <CargaMasivaGraduadosModal
                isOpen={isCargaMasivaOpen}
                onClose={() => setIsCargaMasivaOpen(false)}
            />
        </div>
    );
};

export default ReportesDocentes;
