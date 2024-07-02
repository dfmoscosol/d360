import React, { useState, useEffect } from "react";
import { DataTable } from "@components";
import { useDispatch } from "react-redux";

import { Loader, FetchError } from "@components";
import { useGetAllObservadoresQuery } from "@redux/services/evento/eventoApi";
import InscripcionManual from "../InscripcionManual/InscripcionManual";
import { Button, Modal } from "@components";
import { Link } from "react-router-dom";
//import { useInscribirDocenteMutation } from "@redux/services/docente/docenteApi";
import { useAgregarObservadoresMutation, useEditObservadoresMutation, useDeleteObservadoresMutation } from "../../../../../redux/services/evento/eventoApi";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import FormLabel from "../FormLabel/FormLabel";
import EventoView, {
  SectionContainer,
} from "../EventoView/EventoView";

const ObservadoresTab = ({ id, idTaller }) => {
  /**
   * DATA FETCHING
   */
  const {
    data,
    refetch: refetchGetAllObservadores,
    error,
    isLoading,
    isFetching,
    isError,
  } = useGetAllObservadoresQuery();

  const dispatch = useDispatch();

  const [
    agregarObservadores,
    {
      data: responseAdd,
      isLoading: isUpdatingAdd,
      isSuccess: isSuccessAdd,
      isError: isErrorAdd,
      error: errorAdd,
    },
  ] = useAgregarObservadoresMutation();

  const [
    editObservadores,
    {
      data: responseEdit,
      isLoading: isUpdatingEdit,
      isSuccess: isSuccessEdit,
      isError: isErrorEdit,
      error: errorEdit,
    },
  ] = useEditObservadoresMutation();

  const [
    	deleteObservadores,
    {
      data: responseDelete,
      isLoading: isUpdatingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteObservadoresMutation();

  // MENSAJES DE NOTIFICACION
  useEffect(() => {
    if (isSuccessAdd) {
      //console.log(responseAdd);
      triggerNotification(dispatch, {
        message: responseAdd.respuesta,
        type: "success",
      });
      refetchGetAllObservadores();
      setModalOpen(false)
      setEliminar(false)
      setNombreForm("")
    } else if (isErrorAdd && errorAdd) {
      triggerNotification(dispatch, {
        message: errorAdd.data.error || "Error al actualizar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessAdd, isErrorAdd, errorAdd, dispatch]);

  useEffect(() => {
    if (isSuccessEdit) {
      //console.log(responseEdit);
      triggerNotification(dispatch, {
        message: responseEdit.respuesta,
        type: "success",
      });
      refetchGetAllObservadores();
      setModalOpen(false)
      setEliminar(false)
      setSelectedRows([])
      setNombreForm("")
    } else if (isErrorEdit && errorEdit) {
      triggerNotification(dispatch, {
        message: errorEdit.data.error || "Error al actualizar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessEdit, isErrorEdit, errorEdit, dispatch]);

  useEffect(() => {
    if (isSuccessDelete) {
      //console.log(responseDelete);
      triggerNotification(dispatch, {
        message: responseDelete.respuesta,
        type: "success",
      });
      refetchGetAllObservadores();
      setModalOpen(false)
      setSelectedRows([])
      setNombreForm("")
      setEliminar(false)
    } else if (isErrorDelete && errorDelete) {
      triggerNotification(dispatch, {
        message: errorDelete.data.error || "Error al actualizar la capacitación",
        type: "error",
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, dispatch]);

  /**
   * PARA LOS DOCENTES INSCRITOS
   */
  const [selectedRows, setSelectedRows] = useState([]);
  const [nombreForm, setNombreForm] = useState("");

  /**
   * PARA EL MODAL DELETE
   */
  const [isModalOpen, setModalOpen] = useState(false);
  const [eliminar, setEliminar] = useState(false);

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  /**
   * MANEJO DE LA DATA
   */
  const docentes = data.respuesta;

  const columnMappings = {
    nombre: "Nombres"
  };

  const columnOrder = ["nombre"];

  const toggleRowSelection = (id, nombre) => {
    setSelectedRows((prevSelectedRows) => {
      return prevSelectedRows.includes(id) ? [] : [id];
    });
    if (nombreForm === nombre) {
      setNombreForm("")
    } else {
      setNombreForm(nombre)
    }
  };

  const handleChangeNombre = (nombre) => {
    console.log(nombre)
    setNombreForm(nombre)
  };

  /**
   * PARA INSCRIBIR DOCENTES
   */

  const handleAgregarObservadores = () => {
    /**/
    let dataBody;
    dataBody = {
      nombre: nombreForm
    };
    console.log("dataBody", dataBody);
    agregarObservadores(dataBody);
  };

  const handleEditarObservadores = () => {
    let dataBody;
    dataBody = {
      body: {
        nombre: nombreForm
      },
      id: selectedRows[0]
    };
    console.log("dataBody", dataBody);
    editObservadores(dataBody)
  };

  const handleEliminarObservadores = () => {
    let dataBody;
    dataBody = {
      id: selectedRows[0]
    };
    console.log("dataBody", dataBody);
    deleteObservadores(dataBody)
  };

  return (
    <div className="">
      <Modal
        //isOpen={true}
        isOpen={isModalOpen}
        message={selectedRows.length > 0 ? (eliminar?("Confirmar la eliminación del observador."):("Confirmar la edición del observador.")) : ("Confirmar la agregación del observador.")}
        onClose={() => {setModalOpen(false),setEliminar(false)}}
        type={"success"}
        title={selectedRows.length > 0 ? (eliminar?("Eliminar"):("Editar")) : ("Agregar")}
        showCancel={!isSuccessAdd}
      >
        {selectedRows.length > 0 ? (
          <>
            {eliminar ? (
              <Button
                value="Eliminar"
                type="error"
                size="medium"
                icon="delete"
                isPrimary={true}
                onClick={handleEliminarObservadores}
                isLoading={isUpdatingDelete}
              />
            ) : (
              <Button
                value="Actualizar"
                type="success"
                size="medium"
                icon="check"
                isPrimary={true}
                onClick={handleEditarObservadores}
                isLoading={isUpdatingEdit}
              />
            )}
          </>
        ) : (
          <>
            <Button
              value="Agregar"
              type="success"
              size="medium"
              icon="check"
              isPrimary={true}
              onClick={handleAgregarObservadores}
              isLoading={isUpdatingAdd}
            />
          </>)}

      </Modal>
      <div className="flex flex-col">
        <SectionContainer>
          <DataTable
            initialData={docentes}
            idColumn={"id"}
            searchColumns={["nombre"]}
            columnMappings={columnMappings}
            columnOrder={columnOrder}
            selectedRows={selectedRows}
            toggleRowSelection={toggleRowSelection}
            singleSelect={true} // Permitir solo una selección
          />
        </SectionContainer>
        <div className="border mt-4 border-primary_gray_5 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center">

            {selectedRows.length > 0 ? (
              <>
                <span className="text-base font-medium text-primary_text_1">
                  Editar Observador
                </span>
                <div className="flex gap-2 items-center">
                  <Button
                    value="Eliminar"
                    type="gray"
                    size="small"
                    icon="delete"
                    isPrimary={true}
                    onClick={() => { setModalOpen(true),setEliminar(true) }}
                  />
                  <Button
                    value="Actualizar"
                    type="ucuenca"
                    size="small"
                    icon="check"
                    isPrimary={true}
                    onClick={() => setModalOpen(true)}
                  />
                </div>

              </>
            ) : (
              <><span className="text-base font-medium text-primary_text_1">
                Agregar Observador
              </span>
                <div className="flex gap-2 items-center">
                  <Button
                    value="Agregar"
                    type="ucuenca"
                    size="small"
                    icon="check"
                    isPrimary={true}
                    onClick={() => setModalOpen(true)}
                  />
                </div></>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="col-span-12 flex flex-col gap-1">
              <FormLabel value={"Nombre"} />
              <div className="w-full">
                <input
                  type="text"
                  onChange={(e) => handleChangeNombre(e.target.value)}
                  value={nombreForm}
                  className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                />
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
};

export default ObservadoresTab;
