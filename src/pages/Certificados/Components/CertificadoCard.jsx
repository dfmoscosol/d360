import React, { useState, useEffect } from "react";
import { InfoPill, Button, Modal } from "@components";
import { Link } from "react-router-dom";
import { MdClass, MdDateRange, MdFileDownload, MdAccessTime, MdSchool, MdMoreTime } from "react-icons/md";
import { useEditCertificadoMutation } from "@redux/services/certificado/certificadoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import descargarArchivo from "@helpers/descargarArchivoService";
import { useSelector } from "react-redux";

const CertificadoCard = ({
  horas_certificado,
  horas_acredita,
  institucion,
  nombreCurso,
  fechaCreacion,
  nombres,
  correo,
  idCertificado,
  isApproved,
  handleRefetch,
}) => {
  /**
   * REDUX
   */

  const dispatch = useDispatch();

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
        aceptada: true,
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

  /**
   * PARA EL MODAL DE NO APROBAR
   */
  const [isModalNoApprovedOpenEdit, setModalNoApprovedOpenEdit] =
    useState(false);

  const handleDenegarAprobar = () => {
    editCertificado({
      id: idCertificado,
      body: {
        aceptada: false,
      },
    });
    setModalNoApprovedOpenEdit(false);
  };

  /**
   * PARA DESCARGAR EL ARCHIVO
   */

  const token = useSelector((state) => state.authState.token);

  const descargarCertificado = () => {
    descargarArchivo(idCertificado, token, dispatch);
  };

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

      <Modal
        isOpen={isModalNoApprovedOpenEdit}
        message="¿Desea denegar el Certificado?"
        onClose={() => setModalNoApprovedOpenEdit(false)}
        type={"deny"}
        title={"Denegar Certificado"}
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
            value="Denegar"
            type="error"
            size="medium"
            icon="deny"
            isPrimary={true}
            onClick={handleDenegarAprobar}
          //isLoading={isUpdatingEdit}
          />
        )}
      </Modal>

      <div className="bg-white rounded-lg p-4 flex flex-col hover:shadow-lg transition-all duration-200">
        <div className="flex gap-2 items-center">
          <InfoPill type="date" icon="person" isSquare={true} size="large" />
          <div className="flex flex-col">
            <span className="text-lg font-medium text-primary_text_1">
              {nombres}
            </span>
            <span className="text-sm font-normal text-primary_gray_3">
              {correo}
            </span>
          </div>
        </div>

        <div className="mt-4 border border-primary_gray_5 p-4 rounded-lg flex flex-col gap-4 relative">
          <div className="flex flex-col items-start gap-1">
            {/* First Row: Curso occupies full width */}
            <div className="flex mt-1 gap-2 w-full">
              <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center w-full">
                <div className="p-2 bg-white rounded-lg text-primary_gray_4">
                  <MdClass size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-primary_gray_2 text-xs">Curso</span>
                  <span className="text-primary_text_1 font-medium text-sm">
                    {nombreCurso}
                  </span>
                </div>
              </div>
            </div>

            {/* Second Row: Institución occupies full width */}
            <div className="flex mt-1 gap-2 w-full">
              <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center w-full">
                <div className="p-2 bg-white rounded-lg text-primary_gray_4">
                  <MdSchool size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-primary_gray_2 text-xs">Ofertado por</span>
                  <span className="text-primary_text_1 font-medium text-sm">
                    {institucion}
                  </span>
                </div>
              </div>
            </div>

            {/* Third Row: Horas del certificado and Horas que acredita */}
            <div className="flex mt-1 gap-2 w-full">
              <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center w-1/2">
                <div className="p-2 bg-white rounded-lg text-primary_gray_4">
                  <MdAccessTime size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-primary_gray_2 text-xs">Horas del certificado</span>
                  <span className="text-primary_text_1 font-medium text-sm">
                    {horas_certificado}
                  </span>
                </div>
              </div>
              <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center w-1/2">
                <div className="p-2 bg-white rounded-lg text-primary_gray_4">
                  <MdMoreTime size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-primary_gray_2 text-xs">Horas que acredita</span>
                  <span className="text-primary_text_1 font-medium text-sm">
                    {horas_acredita}
                  </span>
                </div>
              </div>
            </div>

            {/* Fourth Row: Fecha and Download button share half width each */}
            <div className="flex mt-1 gap-2 w-full">
              <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center w-1/2">
                <div className="p-2 bg-white rounded-lg text-primary_gray_4">
                  <MdDateRange size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-primary_gray_2 text-xs">Subido el</span>
                  <span className="text-primary_text_1 font-medium text-sm">
                    {fechaCreacion}
                  </span>
                </div>
              </div>

              <div className="w-1/2">
                <button onClick={descargarCertificado} className="w-full">
                  <div className="bg-primary_gray_1 py-2 px-2 rounded-lg flex gap-2 items-center w-full">
                    <div className="p-2 bg-white rounded-lg text-primary_gray_3">
                      <MdFileDownload size={20} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-primary_gray_3 text-xs">Certificado</span>
                      <span className="text-primary_color_1 font-medium text-sm hover:underline">
                        Descargar
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>


        <div className="flex mt-4 gap-2 ml-auto">
          {isApproved === null ?
            (
              <>
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
                  onClick={() => {
                    setModalNoApprovedOpenEdit(true);
                  }}
                />
              </>

            ) : (
              <>
                {isApproved ? (
                  <InfoPill
                    type={"info"}
                    value={"Aprobado"}
                    size={"small"}
                    icon={"verified"}
                    isRadial={false}
                  />
                ) : (
                  <InfoPill
                    type={"error"}
                    value={"Rechazado"}
                    size={"small"}
                    icon={"close"}
                    isRadial={false}
                  />
                )}
              </>
            )}
        </div>


      </div>

    </>
  );
};

export default CertificadoCard;
