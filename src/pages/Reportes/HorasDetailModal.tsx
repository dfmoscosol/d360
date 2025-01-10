import React from 'react';
import Loader from '../../components/Loader/Loader'
import { RxCross1 } from "react-icons/rx";

const DetalleDocenteModal = ({ isOpen, onClose, isLoading, data }) => {
    if (!isOpen) return null;  // Si no está abierta, no renderiza nada
    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-5 w-[600px] relative">
                {/* Botón de cierre */}
                <button
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <RxCross1/>
                </button>

                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-2">
                            Detalle de Horas de Formacion
                        </h2>

                        <h2 className="text-md text-gray-500 mb-2">
                            {data?.docente.nombre} - Total: {data?.total_horas ?? 0} horas
                        </h2>


                        <table className="w-full border-collapse md:table table-auto">
                            <thead className="bg-primary_gray_1 rounded-lg">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Evento</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">Horas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.eventos?.map((ev, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="p-2 text-sm text-gray-800">{ev.nombre_evento}</td>
                                        <td className="p-2 text-sm text-gray-600 text-center">{ev.horas_evento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default DetalleDocenteModal;
