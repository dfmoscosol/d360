import React, { useState, useEffect, useRef } from "react";

import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

import { Notification, Modal } from "@components";
import { showNotification } from "@redux/features/notification/notificationSlice";

import {
  MdClose,
  MdDelete,
  MdOutlineEdit,
  MdSave,
  MdCheckCircle,
} from "react-icons/md";

const KeywordCard = ({ oldKeywords }) => {
  console.log(oldKeywords);

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
   * Para el modal
   */
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    const dataBody = {
      id: id_capacitacion,
    };
    console.log("confirm");
    setModalOpen(false);
    //deleteCapacitacion(dataBody);
  };

  /**
   * Para guardar el edit
   */

  const handleSaveEdit = (id) => {
    console.log("guardando");
    console.log(id);
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          const dataBody = {
            id: input.id_taller,
            body: { nombre: input.value },
          };
          //console.log(dataBody);
          //editTaller(dataBody);
          //console.log("editado");
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

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Notification />
      <Modal
        isOpen={isModalOpen}
        message="¿Desea eliminar esta palabra clave?"
        onClose={() => setModalOpen(false)}
        type={"error"}
        title={"Eliminar Palabra Clave"}
      >
        <button
          className="font-medium px-4 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 active:bg-red-600 hover:text-white transition-all duration-200"
          onClick={handleConfirmDelete}
        >
          Eliminar Palabra
        </button>
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
                  <div className="flex items-center gap-1 bg-green-200 text-green-700 rounded-xl p-1">
                    <AiFillLike size={15} />
                  </div>
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
                    <button
                      className="rounded-full p-2 flex items-center bg-blue-100 text-blue-800"
                      onClick={() => handleEnableEdit(keyword.id)}
                    >
                      <MdOutlineEdit size={18} />
                    </button>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="rounded-full p-2 flex items-center bg-red-100 text-red-800"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(keyword.id)}
                      className="rounded-full p-2 flex items-center bg-green-100 text-green-800"
                    >
                      <MdSave size={18} />
                    </button>
                    <button
                      onClick={() => handleCancelEdit(keyword.id)}
                      className="rounded-full p-2 flex items-center bg-primary_gray_1 border-primary_gray_3 text-primary_gray_3 hover:bg-primary_gray_3 hover:text-white"
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1 bg-green-200 text-green-700 rounded-xl p-1">
                    <AiFillLike size={15} />
                  </div>
                  <span className="font-medium text-sm text-primary_gray_3 p-1">
                    {keyword.palabra}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-green-200 text-green-700 rounded-xl px-3 py-1 flex gap-1 items-center">
                    <MdCheckCircle size={18} />
                    <span className="text-xs">Aprobar</span>
                  </button>
                  <button className="bg-red-200 text-red-700 rounded-xl px-3 py-1 flex gap-1 items-center">
                    <MdDelete size={18} />
                    <span className="text-xs">Rechazar</span>
                  </button>
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
