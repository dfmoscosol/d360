import React, { useState, useEffect } from "react";

import { InfoPill, Pill, Button, Modal } from "@components";
import { Link } from "react-router-dom";
import { MdDateRange, MdFileDownload } from "react-icons/md";
import axios from "axios";
import { useEditCertificadoMutation } from "@redux/services/certificado/certificadoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

const CertificadoCard = ({
  nombreCurso,
  urlImagen,
  urlCurso,
  fechaCreacion,
  nombres,
  correo,
  urlLogo,
  idCertificado,
  isApproved,
  handleRefetch,
}) => {
  /**
   * REDUX
   */

  const dispatch = useDispatch();

  const descargarCertificado = async () => {
    try {
      const response = await axios.get(
        `https://d360api.ucuenca.edu.ec/descargar_certificado/${idCertificado}`,
        {
          responseType: "blob", // Muy importante para archivos binarios como PDF
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      window.open(url, "_blank").focus();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el certificado", error);
    }
  };

  const [
    editCertificado,
    {
      data: responseEdit,
      isLoading: isUpdatingEdit,
      isSuccess: isSuccessEdit,
      isError: isErrorEdit,
      error: errorEdit,
    },
  ] = useEditCertificadoMutation();

  const handleConfirmarAprobar = () => {
    editCertificado({
      id: idCertificado,
      body: {
        isapproved: true,
      },
    });
    setModalOpenEdit(false);
  };

  /**
   * PARA EL MODAL
   */
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);

  useEffect(() => {
    if (isSuccessEdit) {
      console.log(responseEdit);
      triggerNotification(dispatch, {
        message: responseEdit.respuesta,
        type: "success",
      });
      handleRefetch();
    } else if (isErrorEdit && errorEdit) {
      console.log(errorEdit);
      triggerNotification(dispatch, {
        message: errorEdit.data.error || "Error al editar el certificado.",
        type: "error",
      });
    }
  }, [isSuccessEdit, isErrorEdit, errorEdit, dispatch]);

  return (
    <>
      <Modal
        isOpen={isModalOpenEdit}
        message="¿Desea aprobar el Certificado?"
        onClose={() => setModalOpenEdit(false)}
        type={"success"}
        title={"Aprobar Certificado"}
        showCancel={!isSuccessEdit}
      >
        {isSuccessEdit ? (
          <Link to="/eventos">
            <Button
              value="Actualización exitosa"
              type="success"
              size="medium"
              icon="check"
              isPrimary={true}
            />
          </Link>
        ) : (
          <Button
            value="Aprobar"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={handleConfirmarAprobar}
            isLoading={isUpdatingEdit}
          />
        )}
      </Modal>

      <div className="bg-white rounded-lg p-4 flex flex-col hover:shadow-lg transition-all duration-200 ">
        <div className="flex gap-2 items-center">
          <InfoPill type="date" icon="person" isSquare={true} size="large" />
          <div className="flex flex-col">
            <span className="text-lg font-medium text-primary_color_1">
              {nombres}
            </span>
            <span className="text-sm font-normal text-primary_gray_2">
              {correo}
            </span>
          </div>
        </div>
        <div className="mt-4 border border-primary_gray_5 p-4 rounded-lg flex flex-col md:flex-row gap-4 relative">
          <div className="w-full md:w-64 relative">
            <img src={urlImagen} alt="Imagen del curso" />
            <div className="absolute right-1 bottom-1 bg-white rounded-xl py-1 px-2 w-20">
              <img src={urlLogo} alt="Imagen del curso" />
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4">
            <Link to={urlCurso} target="_blank" rel="noopener noreferrer">
              <span className="text-lg font-medium text-primary_color_1">
                {nombreCurso}
              </span>
            </Link>
            {isApproved && (
              <InfoPill
                type={"info"}
                value={"Verificado"}
                size={"small"}
                icon={"verified"}
                isRadial={false}
              />
            )}

            <div className="flex  mt-2 gap-2 ">
              <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center">
                <div className="p-2 bg-white rounded-lg text-primary_gray_3">
                  <MdDateRange size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-primary_gray_3 text-xs">
                    Creado el
                  </span>
                  <span className="text-primary_color_1 font-medium text-sm">
                    {fechaCreacion}
                  </span>
                </div>
              </div>

              <button onClick={descargarCertificado}>
                <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center">
                  <div className="p-2 bg-white rounded-lg text-primary_gray_3">
                    <MdFileDownload size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-primary_gray_3 text-xs">
                      Certificado
                    </span>
                    <span className="text-primary_color_1 font-medium text-sm">
                      Descargar
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {!isApproved && (
              <div className="flex mt-2 gap-2">
                <Button
                  type={"ucuenca"}
                  value={"Aprobar"}
                  size={"small"}
                  icon={"approve"}
                  isPrimary={true}
                  onClick={() => {
                    setModalOpenEdit(true);
                  }}
                />
                <Button
                  type={"error"}
                  value={"Denegar"}
                  size={"small"}
                  icon={"close"}
                  isPrimary={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificadoCard;
