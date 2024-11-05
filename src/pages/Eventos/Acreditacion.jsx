import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import EventoView, { SectionContainer, customStyles } from "../Eventos/ui/components/EventoView/EventoView";
import { ContainerPage, Button, Loader, FetchError, Modal } from "@components";
import { MdOutlineSearch } from "react-icons/md";
import {
  useGetAllEventosQuery,
  useLazyGetAcreditacionesQuery,
  useUpdateAcreditacionesMutation,
  useUploadAcreditacionesMutation,
  useUploadPdfMutation,
  useDeletePdfMutation,
  useLazyDownloadPdfQuery, useEditEventoMutation
} from "@redux/services/evento/eventoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

const Acreditacion = () => {
  const dispatch = useDispatch();
  const [editEvento, { data: response, isLoading: isUpdatingEvent, isSuccess, isError: isUpdateEventError, error: updateEventError }] = useEditEventoMutation();
  const { data: apiData, error, isLoading, isFetching, isError } = useGetAllEventosQuery();
  const [triggerGetAcreditaciones, { data: dataAcreditacion, error: errorAcreditacion, isLoading: isLoadingAcreditacion, isFetching: isFetchingAcreditacion, isError: isErrorAcreditacion }] = useLazyGetAcreditacionesQuery();
  const [updateAcreditaciones, { data: updateResponse, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateAcreditacionesMutation();
  const [uploadAcreditaciones, { data: uploadResponse, isSuccess: isUploadSuccess, isError: isUploadError, error: uploadError }] = useUploadAcreditacionesMutation();
  const [uploadPdf, { isLoading: isUploadPdfLoading, isSuccess: isUploadPdfSuccess, isError: isUploadPdfError, error: uploadPdfError }] = useUploadPdfMutation();
  const [deletePdf, { isLoading: isDeletePdfLoading, isSuccess: isDeletePdfSuccess, isError: isDeletePdfError, error: deletePdfError }] = useDeletePdfMutation();
  const [triggerDownloadPdf] = useLazyDownloadPdfQuery();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    if (selectedEvent && selectedEvent.tipo !== 1) {
      triggerGetAcreditaciones({ id_evento: selectedEvent.value });
    }
  }, [selectedEvent, triggerGetAcreditaciones, isUploadSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (selectedEvent && selectedEvent.tipo === 1 && selectedWorkshop) {
      triggerGetAcreditaciones({ id_evento: selectedEvent.value, id_taller: selectedWorkshop.value });
    }
  }, [selectedEvent, selectedWorkshop, triggerGetAcreditaciones, isUploadSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (dataAcreditacion && dataAcreditacion.respuesta) {
      setData(dataAcreditacion.respuesta);
    }
  }, [dataAcreditacion]);

  useEffect(() => {
    if (isUpdateSuccess) {
      triggerNotification(dispatch, {
        message: updateResponse?.respuesta || "Datos guardados exitosamente",
        type: "success",
      });
    } else if (isUpdateError && updateError) {
      triggerNotification(dispatch, {
        message: updateError?.data?.error || "Error al guardar los datos",
        type: "error",
      });
    }
  }, [isUpdateSuccess, isUpdateError, updateError, dispatch]);

  useEffect(() => {
    if (isUploadSuccess) {
      triggerNotification(dispatch, {
        message: uploadResponse?.respuesta || "Archivo cargado exitosamente",
        type: "success",
      });
      setFile(null);
    } else if (isUploadError && uploadError) {
      triggerNotification(dispatch, {
        message: uploadError?.data?.error || "Error al cargar el archivo",
        type: "error",
      });
    }
  }, [isUploadSuccess, isUploadError, uploadError, dispatch]);

  useEffect(() => {
    if (isUploadPdfSuccess) {
      triggerNotification(dispatch, {
        message: "Archivo PDF cargado exitosamente",
        type: "success",
      });
      setModalOpen(false);
    } else if (isUploadPdfError && uploadPdfError) {
      console.log("uploadPdfError")
      console.log(uploadPdfError)
      triggerNotification(dispatch, {
        message: uploadPdfError?.data?.error || "Error al cargar el archivo PDF",
        type: "error",
      });
    }
  }, [isUploadPdfSuccess, isUploadPdfError, uploadPdfError, dispatch]);

  useEffect(() => {
    if (isDeletePdfSuccess) {
      triggerNotification(dispatch, {
        message: "Archivo PDF eliminado exitosamente",
        type: "success",
      });
      setModalOpen(false);
    } else if (isDeletePdfError && deletePdfError) {
      triggerNotification(dispatch, {
        message: deletePdfError?.data?.error || "Error al eliminar el archivo PDF",
        type: "error",
      });
    }
  }, [isDeletePdfSuccess, isDeletePdfError, deletePdfError, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      triggerNotification(dispatch, {
        message: "Acreditación de certificado actualizada correctamente",
        type: "success",
      });
      setModalOpen(false);
    } else if (isUpdateEventError && updateEventError) {
      triggerNotification(dispatch, {
        message: updateEventError?.data?.error || "Error al actualizar la acreditación de certificado",
        type: "error",
      });
    }
  }, [isSuccess, isUpdateEventError, updateEventError, dispatch]);

  if (isLoading || isFetching || isLoadingAcreditacion || isFetchingAcreditacion) return <Loader />;
  if (isError) return <FetchError error={error} />;
  if (isErrorAcreditacion) {
    setData([]);
  }

  const eventos = apiData.respuesta.eventos;

  const handleToggle = (index, field) => {
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: !item[field] };
      }
      return item;
    });
    setData(newData);
  };

  const handleCommentChange = (index, value) => {
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, comments: value };
      }
      return item;
    });
    setData(newData);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file || !selectedEvent) {
      triggerNotification(dispatch, {
        message: "Debe seleccionar un archivo y un evento",
        type: "error",
      });
      return;
    }
    setModalMessage("¿Desea cargar el archivo?");
    setModalAction(() => confirmUpload);
    setModalOpen(true);
  };

  const confirmUpload = async () => {
    const id_evento = selectedEvent.value;
    const id_taller = selectedWorkshop ? selectedWorkshop.value : null;
    try {
      await uploadAcreditaciones({ id_evento, id_taller, file }).unwrap();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
    }
  };

  const handleFileUploadChange = (index, e) => {
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, file: e.target.files[0] };
      }
      return item;
    });
    setData(newData);
  };

  const handleFileUpload = (index) => {
    const item = data[index];
    if (!item.file) {
      triggerNotification(dispatch, {
        message: "Debe seleccionar un archivo para subir",
        type: "error",
      });
      return;
    }
    setModalMessage("¿Desea subir el archivo?");
    setModalAction(() => () => confirmFileUpload(item.id, item.file));
    setModalOpen(true);
  };

  const confirmFileUpload = async (acreditacionId, file) => {
    try {
      await uploadPdf({ acreditacionId, file }).unwrap();
      triggerGetAcreditaciones({ id_evento: selectedEvent.value, id_taller: selectedWorkshop?.value });
      setModalOpen(false);
    } catch (error) {
      console.error("Error al cargar el archivo PDF:", error);
    }
  };

  const handleDownload = async (acreditacionId) => {
    try {
      const response = await triggerDownloadPdf(acreditacionId).unwrap();
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `acreditacion_${acreditacionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      triggerNotification(dispatch, {
        message: "Error al descargar el archivo PDF",
        type: "error",
      });
    }
  };

  const handleDelete = (acreditacionId) => {
    setModalMessage("¿Desea eliminar el archivo PDF?");
    setModalAction(() => () => confirmDelete(acreditacionId));
    setModalOpen(true);
  };

  const confirmDelete = async (acreditacionId) => {
    try {
      await deletePdf(acreditacionId).unwrap();
      triggerGetAcreditaciones({ id_evento: selectedEvent.value, id_taller: selectedWorkshop?.value });
      setModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el archivo PDF:", error);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleEventChange = (selectedOption) => {

    if (selectedOption.tipo === 1) {
      setData([]);
    }
    setSelectedEvent(selectedOption);
    setSelectedWorkshop(null); // Reset workshop when event changes
  };

  const handleWorkshopChange = (selectedOption) => {
    setSelectedWorkshop(selectedOption);
  };

  const handleConfirmEdit = () => {
    setModalMessage("¿Desea guardar los cambios?");
    setModalAction(() => handleConfirmEditCapacitacion);
    setModalOpen(true);
  };

  const handleConfirmEditCapacitacion = async () => {
    setIsUpdating(true);
    try {
      await updateAcreditaciones(data).unwrap();
      setIsUpdating(false);
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setIsUpdating(false);
    }
  };

  const events = eventos.map(event => ({
    value: event.id,
    label: event.nombre,
    tipo: event.tipo // Add event type to option
  }));

  const workshops = selectedEvent && eventos.find(event => event.id === selectedEvent.value)?.talleres?.map(taller => ({
    value: taller.id,
    label: taller.nombre
  })) || [];

  return (
    <ContainerPage>
      <EventoView>
        {apiData && <div className="mb-4">
          <Select
            options={events}
            value={selectedEvent}
            onChange={handleEventChange}
            placeholder="Seleccionar Evento"
            className="mb-4"
            styles={customStyles}
          />
          {selectedEvent && selectedEvent.tipo === 1 && (
            <Select
              options={workshops}
              value={selectedWorkshop}
              onChange={handleWorkshopChange}
              placeholder="Seleccionar Taller"
              className="mb-4"
              styles={customStyles}
            />
          )}
          {selectedEvent && ((selectedEvent.tipo !== 4 && selectedEvent.tipo !== 1) || (selectedEvent.tipo === 1 && selectedWorkshop !== null)) &&
            <div className="mt-4 flex items-center justify-end space-x-4">
              <label className="block">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload').click()}
                  className="cursor-pointer text-sm text-primary_gray_4 border border-gray-300 rounded-md py-1 px-4 bg-white hover:bg-gray-100 "
                >
                  {file ? (file.name) : ("Seleccionar archivo")}
                </button>
              </label>
              <Button
                type="ucuenca"
                size="medium"
                value="Cargar"
                icon="upload"
                onClick={handleUpload}
                isPrimary={true}
                className="py-2 px-4 rounded-md flex items-center space-x-2"
              >
              </Button>
            </div>}
        </div>}
        {data.length !== 0 && <SectionContainer>
          <div className="w-full flex flex-col">
            <table className="border-collapse md:table mt-2 table-auto">
              <thead className="bg-primary_gray_1">
                <tr className="rounded-lg">
                  <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Nombres</th>
                  <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Correo Institucional</th>
                  {selectedEvent && selectedEvent.tipo === 4 ? (
                    <>
                      <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Archivo</th>
                      <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Acción</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Asistió</th>
                      <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Aprobó</th>
                      <th className="py-2 font-medium text-sm text-primary_text_1 p-2 text-center">Comentarios</th>
                    </>

                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">{item.name}</td>
                    <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">{item.email}</td>
                    {selectedEvent && selectedEvent.tipo === 4 ? (
                      <>
                        {item.has_pdf ? (
                          <>
                            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                              <div className="inline-block">
                                <Button
                                  type="gray"
                                  size="small"
                                  icon="pdf"
                                  value="Descargar"
                                  onClick={() => handleDownload(item.id)}
                                  isPrimary={true}
                                />
                              </div>
                            </td>
                            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                              <div className="inline-block">
                                <Button
                                  type="error"
                                  size="small"
                                  value="Eliminar"
                                  icon="delete"
                                  onClick={() => handleDelete(item.id)}
                                  isPrimary={true}
                                  className="py-2 px-4 rounded-md space-x-2"
                                />
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                              {item.file ? (
                                <label className="block">
                                  <input
                                    type="file"
                                    id={`file-upload-${index}`}
                                    className="hidden"
                                    onChange={(e) => handleFileUploadChange(startIndex + index, e)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => document.getElementById(`file-upload-${index}`).click()}
                                    className="cursor-pointer text-sm text-primary_gray_4 border border-gray-300 rounded-md py-1 px-4 bg-white hover:bg-gray-100 "
                                  >
                                    {item.file.name}
                                  </button>
                                </label>
                              ) : (
                                <label className="block">
                                  <input
                                    type="file"
                                    id={`file-upload-${index}`}
                                    className="hidden"
                                    onChange={(e) => handleFileUploadChange(startIndex + index, e)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => document.getElementById(`file-upload-${index}`).click()}
                                    className="cursor-pointer text-sm text-primary_gray_4 border border-gray-300 rounded-md py-1 px-4 bg-white hover:bg-gray-100 "
                                  >
                                    Seleccionar
                                  </button>
                                </label>
                              )}
                            </td>
                            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center flex justify-center items-center">
                              <Button
                                type="ucuenca"
                                size="small"
                                value="Subir"
                                icon="upload"
                                onClick={() => handleFileUpload(startIndex + index)}
                                isPrimary={true}
                                className="py-2 px-4 rounded-md flex items-center space-x-2"
                              />
                            </td>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                          <Switch
                            checked={item.attended}
                            onChange={() => handleToggle(startIndex + index, "attended")}
                            className={`${item.attended ? "bg-green-500" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
                            aria-label={`Toggle attended for ${item.name}`}
                          >
                            <span
                              className={`${item.attended ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`}
                            />
                          </Switch>
                        </td>
                        <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                          <Switch
                            checked={item.passed}
                            onChange={() => handleToggle(startIndex + index, "passed")}
                            className={`${item.passed ? "bg-green-500" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
                            aria-label={`Toggle passed for ${item.name}`}
                          >
                            <span
                              className={`${item.passed ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`}
                            />
                          </Switch>
                        </td>
                        <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                          <input
                            type="text"
                            value={item.comments}
                            onChange={(e) => handleCommentChange(startIndex + index, e.target.value)}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                            aria-label={`Comments for ${item.name}`}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center bg-primary_gray_1 rounded-lg p-2">
              <Button
                value="Anterior"
                type="gray"
                size="small"
                icon="left"
                onClick={handlePrevPage}
                extra="px-2"
                isDisabled={currentPage === 1}
              />
              <span className="text-sm font-medium text-primary_text_1">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                value="Siguiente"
                type="gray"
                size="small"
                icon="right"
                onClick={handleNextPage}
                extra="px-2"
                isDisabled={currentPage === totalPages}
              />
            </div>
          </div>
          {selectedEvent && selectedEvent.tipo !== 4 && <div className="flex items-center justify-center col-span-12 gap-4 mt-4">
            <Button
              type="ucuenca"
              icon={"saveEdit"}
              buttonType={"submit"}
              value={"Guardar"}
              size={"medium"}
              isLoading={false}
              isPrimary={true}
              onClick={handleConfirmEdit}
            />
          </div>}
        </SectionContainer>}
      </EventoView>
      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        type={"success"}
        title={"Confirmación"}
        showCancel={true}
      >
        {
          <Button
            value="Confirmar"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={modalAction}
            isLoading={isUpdating || isUploadPdfLoading || isDeletePdfLoading || isUpdatingEvent}
          />
        }
      </Modal>
    </ContainerPage>
  );
};

export default Acreditacion;
