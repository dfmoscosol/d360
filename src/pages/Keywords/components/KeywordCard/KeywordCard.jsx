import React, { useState, useEffect, useRef } from "react";

import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

import { Notification, Modal, Button, InfoPill } from "@components";
import { showNotification } from "@redux/features/notification/notificationSlice";

import {
  MdClose,
  MdDelete,
  MdOutlineEdit,
  MdSave,
  MdCheckCircle,
} from "react-icons/md";

import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";

import { useUpdateKeywordMutation } from "@redux/services/keyword/keywordApi";
import { useDeleteKeywordMutation } from "@redux/services/keyword/keywordApi";

const KeywordCard = ({ oldKeywords, competencia, handleRefetch }) => {
  //console.log(oldKeywords);
  /**
   * REDUX
   */

  const dispatch = useDispatch();

  // PARA ACTUALIZAR
  const [
    updateKeyword,
    {
      data: responseUpdate,
      isLoading: isUpdatingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateKeywordMutation();

  // PARA BORRAR
  const [
    deleteKeyword,
    {
      data: responseDelete,
      isLoading: isUpdatingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteKeywordMutation();

  /**
   * PARA LOS INPUT
   */
  const [inputs, setInputs] = useState([]);

  // Crear una referencia para cada keyword
  const refs = useRef(oldKeywords.map(() => React.createRef()));

  useEffect(() => {
    // Inicialización del estado basada en oldKeywords
    const initialInputs = oldKeywords.map((keyword, index) => {
      return {
        ...keyword,
        ref: refs.current[index], // Usar la referencia existente
        isEnableEdit: false,
        originalValue: keyword.palabra,
      };
    });
    setInputs(initialInputs);
  }, [oldKeywords]);

  const handleEnableEdit = (id) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, isEnableEdit: true };
        }
        return input;
      })
    );
  };

  const handleCancelEdit = (id) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return {
            ...input,
            isEnableEdit: false,
            palabra: input.originalValue,
          };
        }
        return input;
      })
    );
  };

  // Utilizar useEffect para enfocar el input cuando isEnableEdit es true
  useEffect(() => {
    inputs.forEach((input) => {
      if (input.isEnableEdit) {
        input.ref.current?.focus();
      }
    });
  }, [inputs]);

  /**
   * Para el modal de borrar
   */
  const [isModalOpen, setModalOpen] = useState(false);

  /**
   * Para guardar el edit
   */

  const handleSaveEdit = (id) => {
    console.log("guardando");
    console.log(id);
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          console.log("confirmando");
          console.log(input);
          const dataBody = {
            competencia: competencia,
            id: id,
            body: { nombre: input.palabra },
          };
          console.log(dataBody);
          updateKeyword(dataBody);
          return { ...input, enableEdit: false };
        }
        return input;
      })
    );
  };

  const handleInputChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, palabra: newValue };
        }
        return input;
      })
    );
  };

  /**
   * MODAL PARA ACEPTAR LA PALABRA
   */
  const [isModalAprobarPalabraOpen, setModalAprobarPalabraOpen] =
    useState(false);
  const [aprobarPalabraId, setAprobarPalabraId] = useState(null);

  const handleConfirmAprobarPalabraModal = (id) => {
    setAprobarPalabraId(id);
    setModalAprobarPalabraOpen(true);
    console.log("confirm aprobar");
  };

  const handleConfirmAprobarPalabra = () => {
    console.log("confirmando");
    const dataBody = {
      competencia: competencia,
      id: aprobarPalabraId,
      body: { isapproved: true },
    };
    console.log(dataBody);
    updateKeyword(dataBody);
  };

  useEffect(() => {
    if (isSuccessUpdate) {
      console.log(responseUpdate);
      triggerNotification(dispatch, {
        message: responseUpdate.respuesta,
        type: "success",
      });
      handleRefetch();
    } else if (isErrorUpdate && errorUpdate) {
      console.log(errorUpdate);
      triggerNotification(dispatch, {
        message: errorUpdate.data.error || "Error al editar la palabra clave.",
        type: "error",
      });
    }
  }, [isSuccessUpdate, isErrorUpdate, errorUpdate, dispatch]);

  /**
   * PARA BORRAR / NO APROBAR LA PALABRA
   */
  const [isModalEliminarPalabraOpen, setModalEliminarPalabraOpen] =
    useState(false);
  const [eliminarPalabraId, setEliminarPalabraId] = useState(null);

  const handleConfirmEliminarPalabraModal = (id) => {
    setEliminarPalabraId(id);
    setModalEliminarPalabraOpen(true);
  };

  const handleConfirmEliminarPalabra = () => {
    console.log("confirmando");
    const dataBody = {
      competencia: competencia,
      id: eliminarPalabraId,
    };
    //console.log(dataBody);
    deleteKeyword(dataBody);
  };

  useEffect(() => {
    if (isSuccessDelete) {
      //console.log(responseDelete);
      triggerNotification(dispatch, {
        message: responseDelete.respuesta,
        type: "success",
      });
      handleRefetch();
    } else if (isErrorDelete && errorDelete) {
      console.log(errorDelete);
      triggerNotification(dispatch, {
        message:
          errorDelete.data.error || "Error al eliminar la palabra clave.",
        type: "error",
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, dispatch]);

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Modal
        isOpen={isModalOpen}
        message="¿Desea eliminar esta palabra clave?"
        onClose={() => setModalOpen(false)}
        type={"error"}
        title={"Eliminar Palabra Clave"}
        showCancel={!isSuccessDelete}
      >
        <Button
          type="error"
          onClick={() => handleConfirmEliminarPalabra()}
          icon={"delete"}
          buttonType={"button"}
          value={"Eliminar"}
          size={"medium"}
          isRadial={false}
          isPrimary={true}
          isLoading={isUpdatingDelete}
        />
      </Modal>

      {/**PARA APROBAR LA PALABRA */}
      <Modal
        isOpen={isModalAprobarPalabraOpen}
        message="¿Desea aprobar esta palabra clave?"
        onClose={() => setModalOpen(false)}
        type={"success"}
        title={"Aceptar Palabra Clave"}
        showCancel={!isSuccessUpdate}
      >
        <Button
          type="success"
          onClick={() => handleConfirmAprobarPalabra()}
          icon={"check"}
          buttonType={"button"}
          value={"Aprobar"}
          size={"medium"}
          isRadial={false}
          isPrimary={true}
          isLoading={isUpdatingUpdate}
        />
      </Modal>

      {/**PARA ELIMINAR LA PALABRA */}
      <Modal
        isOpen={isModalEliminarPalabraOpen}
        message="¿Desea eliminar esta palabra clave?"
        onClose={() => setModalEliminarPalabraOpen(false)}
        type={"error"}
        title={"Eliminar Palabra Clave"}
        showCancel={!isSuccessDelete}
      >
        <Button
          type="error"
          onClick={() => handleConfirmEliminarPalabra()}
          icon={"delete"}
          buttonType={"button"}
          value={"Eliminar"}
          size={"medium"}
          isRadial={false}
          isPrimary={true}
          isLoading={isUpdatingDelete}
        />
      </Modal>

      {inputs.map((keyword, index) => (
        <div
          key={index}
          className="bg-white border border-primary_gray_5 rounded-lg py-2 px-4 flex justify-between items-center hover:shadow-lg transition duration-200"
        >
          <div className="flex flex-col gap-2 w-full">
            {keyword.isapproved ? (
              <div className="flex gap-2 items-center w-full justify-between">
                <div className="flex gap-2 items-center">
                  {keyword.isvalid ? (
                    <InfoPill
                      type={"success"}
                      size={"small"}
                      icon={"like"}
                      isRadial={true}
                    />
                  ) : (
                    <InfoPill
                      type={"error"}
                      size={"small"}
                      icon={"dislike"}
                      isRadial={true}
                    />
                  )}

                  <input
                    type="text"
                    value={keyword.palabra}
                    onChange={(e) =>
                      handleInputChange(keyword.id, e.target.value)
                    }
                    ref={keyword.ref} // Asignar la referencia aquí
                    className={`font-medium text-sm text-primary_gray_3 p-1 ${
                      keyword.isEnableEdit
                        ? "bg-primary_gray_1  rounded-lg"
                        : "bg-white"
                    }  `}
                    disabled={!keyword.isEnableEdit}
                  />
                </div>

                {!keyword.isEnableEdit ? (
                  <div className="flex gap-2">
                    <Button
                      type="info"
                      onClick={() => handleEnableEdit(keyword.id)}
                      icon={"edit"}
                      buttonType={"button"}
                      value={"Atrás"}
                      size={"small"}
                      isRadial={true}
                    />
                    <Button
                      type="error"
                      onClick={() =>
                        handleConfirmEliminarPalabraModal(keyword.id)
                      }
                      icon={"delete"}
                      buttonType={"button"}
                      value={""}
                      size={"small"}
                      isRadial={true}
                      isPrimary={true}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="success"
                      onClick={() => handleSaveEdit(keyword.id)}
                      icon={"save"}
                      buttonType={"button"}
                      value={""}
                      size={"small"}
                      isRadial={true}
                      isPrimary={true}
                    />
                    <Button
                      type="gray"
                      onClick={() => handleCancelEdit(keyword.id)}
                      icon={"close"}
                      buttonType={"button"}
                      value={""}
                      size={"small"}
                      isRadial={true}
                      isPrimary={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  {keyword.isvalid ? (
                    <InfoPill
                      type={"success"}
                      size={"small"}
                      icon={"like"}
                      isRadial={true}
                    />
                  ) : (
                    <InfoPill
                      type={"error"}
                      size={"small"}
                      icon={"dislike"}
                      isRadial={true}
                    />
                  )}

                  <span className="font-medium text-sm text-primary_gray_3 p-1">
                    {keyword.palabra}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="success"
                    onClick={() => handleConfirmAprobarPalabraModal(keyword.id)}
                    icon={"check"}
                    buttonType={"button"}
                    value={"Aprobar"}
                    size={"small"}
                    isRadial={false}
                    isPrimary={true}
                  />
                  <Button
                    type="error"
                    onClick={() =>
                      handleConfirmEliminarPalabraModal(keyword.id)
                    }
                    icon={"close"}
                    buttonType={"button"}
                    value={"Rechazar"}
                    size={"small"}
                    isRadial={false}
                    isPrimary={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeywordCard;
