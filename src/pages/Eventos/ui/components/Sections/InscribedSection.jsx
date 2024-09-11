import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineSearch, MdFileDownload } from "react-icons/md";
import descargarArchivoExcel from "@helpers/descargarArchivoExcel";
import { Modal, Button } from "@components";
import PillInscritos from "../PillInscritos/PillInscritos";
import EventoView, { Header, SectionContainer } from "../EventoView/EventoView";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { useEliminarInscripcionMutation } from "@redux/services/evento/eventoApi";

const InscribedSection = (props) => {
  const { docentesInscritos, idEvento, idTaller, handleRefetch } = props;

  // REDUX
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authState.token);

  // PARA ELIMINAR LA INSCRIPCION
  const [
    eliminarInscripcion,
    {
      data: responseEliminar,
      isLoading: isUpdatingEliminar,
      isSuccess: isSuccessEliminar,
      isError: isErrorEliminar,
      error: errorEliminar,
    },
  ] = useEliminarInscripcionMutation();

  const [idDocenteAprobacion, setIdDocenteAprobacion] = useState();
  const [busqueda, setBusqueda] = useState('');
  const [docentesFiltrados, setDocentesFiltrados] = useState(docentesInscritos);

  // Actualizar docentes filtrados cuando cambia la búsqueda o los docentes inscritos
  useEffect(() => {
    const newDocentesFiltrados = docentesInscritos.filter((docente) =>
      docente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      docente.correo.toLowerCase().includes(busqueda.toLowerCase())
    );
    setDocentesFiltrados(newDocentesFiltrados);
  }, [busqueda, docentesInscritos]);

  const handleSearchChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleDescargarInscritos = () => {
    descargarArchivoExcel(token, idEvento, idTaller, dispatch);
  };

  const handleAprobarEliminacion = (id) => {
    setIdDocenteAprobacion(id);
    setModalOpen(true);
  };

  const handleEliminarInscripcion = () => {
    eliminarInscripcion({ id: idDocenteAprobacion });
    setModalOpen(false);
  };

  useEffect(() => {
    if (isSuccessEliminar) {
      triggerNotification(dispatch, {
        message: responseEliminar.respuesta,
        type: "success",
      });
      handleRefetch();
    } else if (isErrorEliminar && errorEliminar) {
      triggerNotification(dispatch, {
        message: errorEliminar.data.error || "Error al eliminar la inscripción",
        type: "error",
      });
    }
  }, [isSuccessEliminar, isErrorEliminar, errorEliminar, dispatch, handleRefetch]);

  // PARA EL MODAL
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <EventoView>
      <Modal
        isOpen={isModalOpen}
        message="¿Desea pasar esta inscripción a pendientes?"
        onClose={() => setModalOpen(false)}
        type={"error"}
        title={"Revertir aprobación de la inscripción"}
        showCancel={!isSuccessEliminar}
      >
        {isSuccessEliminar ? (
          <Link to="/eventos">
            <Button
              value="Eliminación exitosa"
              type="success"
              size="medium"
              icon="check"
              isPrimary={true}
            />
          </Link>
        ) : (
          <Button
            value="Confirmar"
            type="error"
            size="medium"
            icon="delete"
            isPrimary={true}
            onClick={handleEliminarInscripcion}
            isLoading={isUpdatingEliminar}
          />
        )}
      </Modal>
      <div className="flex items-center justify-between">
        <Header
          color="bg-primary_gray_1 text-primary_gray_4"
          title="Inscritos"
          subTitle="Docentes inscritos actualmente"
          hasIcon={false}
        />
        <button onClick={handleDescargarInscritos}>
          <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center">
            <div className="p-2 bg-white rounded-lg text-primary_gray_3">
              <MdFileDownload size={20} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-primary_gray_3 text-xs">
                Inscritos
              </span>
              <span className="text-primary_color_1 font-medium text-sm hover:underline">
                Descargar
              </span>
            </div>
          </div>
        </button>
      </div>

      <SectionContainer>
        <div className="w-full flex items-center justify-end">
          <div className="bg-primary_gray_1 flex gap-1 py-2 px-4 rounded-2xl items-center">
            <MdOutlineSearch size={23} className="text-primary_gray_4" />
            <input
              type="text"
              placeholder="Buscar docente..."
              onChange={handleSearchChange}
              className="text-sm bg-primary_gray_1 border-none outline-none"
            />
          </div>
        </div>
        {docentesFiltrados.length > 0 ? (
          <div className="flex flex-col gap-4">
            {docentesFiltrados.map((docente, index) => (
              <PillInscritos
                key={docente.id_inscripcion} // Usar una key única
                index={index}
                title={docente.nombre}
                subTitle={docente.correo}
                observador={docente.observador}
              >
                <Button
                  value=""
                  type="error"
                  size="small"
                  icon="delete"
                  isPrimary={true}
                  onClick={() => handleAprobarEliminacion(docente.id_inscripcion)}
                  isRadial={true}
                />
              </PillInscritos>
            ))}
          </div>
        ) : (
          <span className="text-sm font-medium text-primary_gray_4">
            Ningún docente inscrito actualmente.
          </span>
        )}
      </SectionContainer>
    </EventoView>
  );
};

export default InscribedSection;
