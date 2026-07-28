import React, { useState, useEffect } from "react";
import { DataTable } from "@components";
import { useDispatch } from "react-redux";

import { Loader, FetchError } from "@components";
import { useGetAllDocentesQuery } from "@redux/services/evento/eventoApi";
import InscripcionManual from "../InscripcionManual/InscripcionManual";
import { Button, Modal } from "@components";
import { useInscribirDocenteMutation } from "../../../../../redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import CargaMasivaModal from "../CargaMasiva/CargaMasivaModal";
import { MdCloudUpload } from "react-icons/md";

const InscripcionesTab = ({ id, handleRefetch, idTaller, docentesInscritos }) => {
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

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessAdd) {
      //console.log(responseAdd);
      triggerNotification(dispatch, {
        message: responseAdd.respuesta,
        type: "success",
      });
      refetchGetAllDocentes();
      handleRefetch();
    } else if (isErrorAdd && errorAdd) {
      triggerNotification(dispatch, {
        message: errorAdd.data.error || "Error al actualizar la capacitación",
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

  /**
   * PARA EL MODAL DE CARGA MASIVA
   */
  const [isCargaMasivaOpen, setCargaMasivaOpen] = useState(false);

  const handleValidosAdded = (uids) => {
    setSelectedRows((prev) => [...new Set([...prev, ...uids])]);
  };

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  /**
   * MANEJO DE LA DATA
   */
  const docentes = data.respuesta;
  // Extraemos los correos de los docentes inscritos en un nuevo Set para búsqueda rápida
  const correosInscritos = new Set(docentesInscritos.map(docente => docente.correo));
  // Filtramos los docentes, dejando solo aquellos cuyo correo no está en el Set de inscritos
  const docentesNoInscritos = docentes.filter(docente => !correosInscritos.has(docente.correo));

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
    let dataBody;

    if (idTaller !== undefined) {
      dataBody = {
        evento_id: id,
        docentes_uid_firebase: selectedRows,
        taller_id: idTaller,
      };
    } else {
      dataBody = {
        evento_id: id,
        docentes_uid_firebase: selectedRows,
      };
    }
    //console.log("dataBody", dataBody);
    agregarInscripciones(dataBody);
  };

 
  const handleInscripcionCompleta = () => {
    console.log("handleInscripcionCompleta");
    refetchGetAllDocentes();
    handleRefetch();
  };

  return (
    <div className="">
      <CargaMasivaModal
        isOpen={isCargaMasivaOpen}
        onClose={() => setCargaMasivaOpen(false)}
        eventoId={id}
        tallerId={idTaller}
        onValidosAdded={handleValidosAdded}
      />

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

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCargaMasivaOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary_color_1 text-primary_color_1 text-xs font-semibold hover:bg-blue-50 transition-all duration-150"
        >
          <MdCloudUpload size={16} />
          Carga Masiva
        </button>
        <span className="text-sm font-medium text-primary_gray_2">Selecciona docentes de la lista</span>
      </div>

      <DataTable
        initialData={docentesNoInscritos}
        idColumn={"id"}
        searchColumns={["nombre","correo"]}
        columnMappings={columnMappings}
        columnOrder={columnOrder}
        selectedRows={selectedRows}
        toggleRowSelection={toggleRowSelection}
      />
      <div className="mt-8 flex flex-col">
        <div className="border border-primary_gray_5 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-primary_text_1">
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
                  type="ucuenca"
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
