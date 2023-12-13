import React, { useState, useEffect } from "react";
import { DataTable } from "@components";
import { useDispatch } from "react-redux";

import { Loader, FetchError } from "@components";
import { useGetAllDocentesQuery } from "@redux/services/evento/eventoApi";
import InscripcionManual from "../InscripcionManual/InscripcionManual";
import { useAgregarInscripcionesMutation } from "@redux/services/inscripcion/inscripcionApi";
import { Button, Modal } from "@components";
import { Link } from "react-router-dom";
//import { useInscribirDocenteMutation } from "@redux/services/docente/docenteApi";
import { useInscribirDocenteMutation } from "../../../../../redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

const InscripcionesTab = ({ id, handleRefetch }) => {
  /**
   * DATA FETCHING
   */
  const {
    data,
    refetch: refetchGetAllDocentes,
    error,
    isLoading,
    isFetching,
    isError,
  } = useGetAllDocentesQuery({ value: id });

  const dispatch = useDispatch();

  const [
    agregarInscripciones,
    {
      data: responseAdd,
      isLoading: isUpdatingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useInscribirDocenteMutation();
  console.log("responseAdd", responseAdd);
  console.log("isUpdatingAdd", isUpdatingAdd);
  console.log("isSuccessAdd", isSuccessAdd);
  console.log("isErrorAdd", isErrorAdd);
  console.log("errorAdd", errorAdd);

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessAdd) {
      console.log(responseAdd);
      //console.log(paramUpdated);
      /*if (paramUpdated.key === "allow_inscripcion") {
        setIsInscripcionTogleActive(paramUpdated.value);
      } else if (paramUpdated.key === "allow_asistencia_entrada") {
        setIsAsistenciaEntradaTogleActive(paramUpdated.value);
      } else if (paramUpdated.key === "allow_asistencia_salida") {
        setIsAsistenciaSalidaTogleActive(paramUpdated.value);
      }*/
      triggerNotification(dispatch, {
        message: "Docentes inscritos con éxito",
        type: "success",
      });
      refetchGetAllDocentes();
      handleRefetch();
    } else if (isErrorAdd && errorAdd) {
      triggerNotification(dispatch, {
        message: errorAdd.message || "Error al actualizar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessAdd, isErrorAdd, errorAdd, dispatch]);

  /**
   * PARA LOS DOCENTES INSCRITOS
   */
  const [selectedRows, setSelectedRows] = useState([]);

  /**
   * PARA EL MODAL DELETE
   */
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  /**
   * MANEJO DE LA DATA
   */
  const docentes = data.respuesta;

  const columnMappings = {
    nombre: "Nombres",
    correo: "Correo Institucional",
  };

  const columnOrder = ["nombre", "correo"];

  const toggleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const selectedObjects = docentes.filter((docente) =>
    selectedRows.includes(docente.id)
  );

  const handleRemoveSelectedRow = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((rowId) => rowId !== id)
    );
  };

  /**
   * PARA INSCRIBIR DOCENTES
   */

  const handleInscribirDocentes = () => {
    /**/
    console.log("xxxx");
    console.log("inscribir docentes");
    const dataBody = {
      id_capacitacion: id,
      ids_docentes: selectedRows,
    };
    console.log("dataBody", dataBody);
    agregarInscripciones(dataBody);
  };

  const handleConfirmDeleteCapacitacion = () => {
    const dataBody = {
      id: id_capacitacion,
    };
    console.log("confirm");
    deleteCapacitacion(dataBody);
    //setModalOpen(false);
  };

  /*
  data: responseAdd,
  isLoading: isUpdatingAdd,
  isSuccess: isSuccessAdd,
  isError: isErrorAdd,
  error: errorAdd,*/

  const handleInscripcionCompleta = () => {
    console.log("handleInscripcionCcompleta");
    refetchGetAllDocentes();
    handleRefetch();
  };

  return (
    <div className="">
      <Modal
        //isOpen={true}
        isOpen={isModalOpen}
        message={`Confirmar la inscripción de ${selectedRows.length} docentes.`}
        onClose={() => setModalOpen(false)}
        type={"success"}
        title={"Inscribir"}
        showCancel={!isSuccessAdd}
      >
        {isSuccessAdd ? (
          <Button
            value="Inscripción exitosa!"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={() => handleInscripcionCompleta()}
          />
        ) : (
          <Button
            value="Inscribir"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={handleInscribirDocentes}
            isLoading={isUpdatingAdd}
          />
        )}
      </Modal>

      <DataTable
        initialData={docentes}
        idColumn={"id"}
        searchColumn={"nombre"}
        columnMappings={columnMappings}
        columnOrder={columnOrder}
        selectedRows={selectedRows}
        toggleRowSelection={toggleRowSelection}
      />
      <div className="mt-8 flex flex-col">
        <div className="border border-primary_gray_5 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-primary_color_1">
              Docentes a inscribir ({selectedRows.length})
            </span>
            {selectedRows.length > 0 && (
              <div className="flex gap-2 items-center">
                <Button
                  value="Quitar todo"
                  type="gray"
                  size="small"
                  icon="close"
                  onClick={() => setSelectedRows([])}
                  isPrimary={false}
                  //isLoading={isUpdatingEdit}
                  //isRadial={true}
                />
                <Button
                  value="Inscribir"
                  type="success"
                  size="small"
                  icon="check"
                  isPrimary={true}
                  //onClick={() => handleInscribirDocentes()}
                  onClick={() => setModalOpen(true)}
                  //isLoading={isUpdatingEdit}
                  //isRadial={true}
                />
              </div>
            )}
          </div>
          {selectedRows.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {selectedObjects.map((object, index) => (
                <InscripcionManual
                  index={index}
                  title={object.nombre}
                  subTitle={object.correo}
                  key={index}
                >
                  <Button
                    value=""
                    type="gray"
                    size="small"
                    icon="close"
                    onClick={() => handleRemoveSelectedRow(object.id)}
                    isRadial={true}
                    isPrimary={true}
                  />
                </InscripcionManual>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InscripcionesTab;
