import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';
import { RxCross1, RxPencil1 } from "react-icons/rx";
import { ToggleSwitch, Button } from '@components';
import { useUpdateDocenteGraduadoMutation } from '../../redux/services/reportes/reportesApi';

const DetalleDocenteModal = ({ isOpen, onClose, isLoading, data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isGraduado, setIsGraduado] = useState(false);

    const [updateDocenteGraduado, { isLoading: isUpdating }] = useUpdateDocenteGraduadoMutation();

    useEffect(() => {
        if (isOpen && data) {
            setIsEditing(false);
            setIsGraduado(data.docente.graduado);
        }
    }, [isOpen, data]);

    const handleSave = async () => {
        try {
            await updateDocenteGraduado({ 
                uid_firebase: data.docente.uid_firebase, 
                graduado: isGraduado 
            }).unwrap();
            setIsEditing(false);
            onClose(); // Optional: close or just exit edit mode
        } catch (error) {
            console.error("Error updating docente:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-5 w-[600px] relative">
                <div className="absolute top-5 right-5 flex gap-4 text-gray-400">
                    {!isLoading && !isEditing && (
                        <button
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsEditing(true)}
                            title="Editar estado graduado"
                        >
                            <RxPencil1 size={18} />
                        </button>
                    )}
                    <button
                        className="hover:text-gray-600 transition-colors"
                        onClick={onClose}
                    >
                        <RxCross1 size={18} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-2">
                            {isEditing ? "Editar Docente" : "Detalle de Horas de Formacion"}
                        </h2>

                        <h2 className="text-md text-gray-500 mb-4">
                            {data?.docente.nombre} - Total: {data?.total_horas ?? 0} horas
                        </h2>

                        {isEditing ? (
                            <div className="flex flex-col gap-6 py-4">
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-800">Estado Graduado</p>
                                        <p className="text-sm text-gray-500">Marcar o desmarcar el estado de graduado para este docente.</p>
                                    </div>
                                    <ToggleSwitch
                                        initialState={isGraduado}
                                        onToggle={(val) => setIsGraduado(val)}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <Button
                                        value="Cancelar"
                                        type="gray"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setIsGraduado(data?.docente.graduado);
                                        }}
                                        isDisabled={isUpdating}
                                    />
                                    <Button
                                        value={isUpdating ? "Guardando..." : "Guardar Cambios"}
                                        type="blue"
                                        onClick={handleSave}
                                        isDisabled={isUpdating}
                                    />
                                </div>
                            </div>
                        ) : (
                            <table className="w-full border-collapse md:table table-auto mt-2">
                                <thead className="bg-primary_gray_1 rounded-lg">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Evento</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold">Horas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data?.eventos?.map((ev, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="p-2 text-sm text-gray-800">{ev.nombre_evento}</td>
                                            <td className="p-2 text-sm text-gray-600 text-center">{ev.horas_evento}</td>
                                        </tr>
                                    ))}
                                    {(!data?.eventos || data.eventos.length === 0) && (
                                        <tr>
                                            <td colSpan={2} className="p-4 text-center text-gray-500">
                                                No hay eventos registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DetalleDocenteModal;
