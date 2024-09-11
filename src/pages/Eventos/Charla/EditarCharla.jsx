import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import ComboBox from "../ui/components/ComboBox/ComboBox";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEditEventoMutation } from "@redux/services/evento/eventoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import { Modal, Button } from "@components";
import { ContainerPage } from "@components";
import ContainerForm from "../ui/components/ContainerForm/ContainerForm";
import FormLabel from "../ui/components/FormLabel/FormLabel";

const EditarCharla = (props) => {
  /**
   * PROPS
   */
  const {
    cupos,
    ponentes,
    hora_inicio,
    duracion,
    fechas,
    horas,
    id,
    nombre,
    ubicacion,
    competencia,
    momento,
    modalidad,
    descripcion,
    handleRefetch,
  } = props;

  /**
   * REDUX
   */

  const dispatch = useDispatch();

  const [
    editEvento,
    { data: response, isLoading: isUpdating, isSuccess, isError, error }, // This is the destructured mutation result
  ] = useEditEventoMutation();

  /**
   * PARA EL FORMULARIO
   */

  const [isValidDate, setValidDate] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // PARA GUARDAR LA DATA DEL FORMULARIO
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
    let areValidDates;
    let validDatesList = [];

    console.log(dates);

    if (dates === null || dates.length == 0) {
      console.log("ERROR: No se ha elegido más de una fecha.");
      setValidDate(false);
      areValidDates = false;
    } else {
      console.log("Se ha elegido más de una fecha.");
      setValidDate(true);
      areValidDates = true;
      validDatesList.push(dates.format("DD-MM-YYYY"));
    }

    const areAllPonentesFilled = inputs.every(input =>
      input.value.trim() !== "" &&
      input.charla.trim() !== ""
    );

    if (!areAllPonentesFilled) {
      console.log("ERROR: Todos los campos deben estar completos.");
      setInputs(inputs => inputs.map(input => ({
        ...input,
        isEmpty: input.value.trim() === "" || input.charla.trim() === ""
      })));
      return; // Detener la ejecución si algún campo está vacío
    }

    if (areValidDates && areAllPonentesFilled) {
      console.log("Se puede enviar el formulario");
      data.fechas = validDatesList;
      data.horas = Number(data.horas);
      data.cupos = Number(data.cupos);
      data.ponentes = inputs.map(input => ({
        nombre: input.value,
        titulo_charla: input.charla
      }));
      data.modalidad = listModalidades.indexOf(selectedModalidad)+1,
      data.competencia = listCompetencias.indexOf(selectedCompetencia)+1,
      data.momento = listMomentos.indexOf(selectedMomento)+1,
      setFormData({
        id: id,
        body: data,
        tipo: "charlas"
      });
      setModalOpen(true);
    } else {
      console.log("No se puede enviar el formulario");
    }
  };

  /**
   * PARA EL DATE PICKER
   */
  const parts = fechas[0].fecha.split("-");
  const formattedDate = `${parts[1]}-${parts[0]}-${parts[2]}`;
  const [dates, setDates] = useState(new DateObject(new Date(formattedDate)));
  const today = new Date();
  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  function handleDateChange(value) {
    setDates(value);
    if (value.length > 0) {
      setValidDate(true);
    }
  }

  function CustomInput({ onFocus, value, onChange }) {
    return (
      <>
        <input
          onFocus={onFocus}
          value={value}
          readOnly
          type="text"
          className="focus:bg-white text-primary_gray_4  font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
          placeholder=""
          onChange={onChange}
        />
      </>
    );
  }
  /**
     * PARA LOS INPUTS DINÁMICOS
     */

  let allPonentesList = [];

  ponentes.forEach((ponente, index) => {
    const nuevoPonente = {
      id: index + 1,
      hasAddButton: index === ponentes.length - 1,
      hasRemoveButton: index === ponentes.length - 1,
      value: ponente.nombre,
      charla: ponente.titulo_charla,
      isEmpty: false,
      originalValue: ponente
    };
    allPonentesList.push(nuevoPonente);
  });

  const [inputs, setInputs] = useState(allPonentesList);

  const handleInputChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, value: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }

  const handleCharlaChange = (id, newValue) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id) {
          return { ...input, charla: newValue, isEmpty: false };
        }
        return input;
      })
    );
  }

  const handleAddInput = () => {
    const newInputs = inputs.map(input => ({
      ...input,
      hasAddButton: false,
      hasRemoveButton: false
    }));

    newInputs.push({
      hasAddButton: true,
      hasRemoveButton: true,
      value: "",
      charla: "",
      isEmpty: false,
    });

    setInputs(newInputs);
  };

  const handleRemoveInput = () => {
    const newInputs = [...inputs];
    newInputs.pop();

    if (newInputs.length > 0) {
      const lastInput = newInputs[newInputs.length - 1];
      lastInput.hasAddButton = true;
      lastInput.hasRemoveButton = true;
    }

    setInputs(newInputs);
  };
  /**
   * COMBOBOX
   */

  const listModalidades = ["Presencial", "Virtual"];
  const listCompetencias = ["Tecnológica", "Pedagógica", "Comunicativa", "De Gestión", "Investigativa"];
  const listMomentos = ["Explorador", "Integrador", "Innovador"];

  // Estado para almacenar el valor seleccionado
  const [selectedModalidad, setSelectedModalidad] = useState(modalidad);
  const [selectedCompetencia, setSelectedCompetencia] = useState(competencia);
  const [selectedMomento, setSelectedMomento] = useState(momento);

  const handleSelect = (value) => {
    setSelectedModalidad(value);
  };

  const handleSelectCompetencia = (value) => {
    setSelectedCompetencia(value);
  };
  const handleSelectMomento = (value) => {
    setSelectedMomento(value);
  };

  /**
   * PARA ENVIAR EL FORMULARIO
   */
  const handleConfirmEditCapacitacion = () => {
    console.log("Se enviará el formulario xxxx");
    console.log(formData);
    editEvento(formData);
  };

  /**
   * PARA LA NOTIFICACION
   */
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      console.log(response);
      triggerNotification(dispatch, {
        message: response.respuesta,
        type: "success",
      });
      handleRefetch();
      navigate(-1);
    } else if (isError && error) {
      console.log(error);
      triggerNotification(dispatch, {
        message: error.data.error || "Error al editar la charla",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  /**
   * PARA EL MODAL
   */
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <ContainerPage>
      <Modal
        isOpen={isModalOpen}
        message="¿Desea guardar los cambios?"
        onClose={() => setModalOpen(false)}
        type={"success"}
        title={"Editar evento"}
        showCancel={!isSuccess}
      >
        {isSuccess ? (
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
            value="Guardar"
            type="success"
            size="medium"
            icon="check"
            isPrimary={true}
            onClick={handleConfirmEditCapacitacion}
            isLoading={isUpdating}
          />
        )}
      </Modal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ContainerForm>

          {/**Nombre */}
          <div className="col-span-12 flex flex-col gap-1">
            <FormLabel value={"Nombre"} />
            <input
              defaultValue={nombre}
              type="text"
              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
              {...register("nombre", { required: true })}
            />
            {errors.nombre && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un nombre válido.
              </span>
            )}
          </div>
          {/**Descripcion */}
          <div className="col-span-12 flex flex-col gap-1">
            <FormLabel value={"Descripción"} />
            <textarea
              defaultValue={descripcion}
              type="text"
              className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
              {...register("descripcion", { required: true })}
            />
            {errors.descripcion && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese una descripción válida.
              </span>
            )}
          </div>

          {/**Competencia */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Competencia"} />
            <div className="w-full">
              <ComboBox
                items={listCompetencias}
                onSelect={handleSelectCompetencia}
                hasBeenSelected={true}
                selected={selectedCompetencia}
              />
            </div>
          </div>

          {/**Momento */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Momento"} />
            <div className="w-full">
              <ComboBox
                items={listMomentos}
                onSelect={handleSelectMomento}
                hasBeenSelected={true}
                selected={selectedMomento}
              />
            </div>
          </div>

          {/**Fecha */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Fecha"} />
            <div className="w-full flex flex-col">
              <DatePicker
                //multiple
                plugins={[<DatePanel />]}
                weekStartDayIndex={1}
                showOtherDays={true}
                minDate={today}
                weekDays={weekDays}
                months={months}
                onChange={handleDateChange}
                style={{
                  width: "100%",
                }}
                value={dates}
                format="DD-MM-YYYY"
                render={<CustomInput />}
              />
              {!isValidDate && (
                <span className="text-red-600 text-sm font-light px-1">
                  Ingrese una fecha válida.
                </span>
              )}
            </div>
          </div>

          {/**Horas */}
          <div className="col-span-3 flex flex-col gap-1">
            <FormLabel value={"Horas"} />
            <div className="w-full">
              <input
                type="number"
                defaultValue={horas}
                className="focus:bg-white text-primary_gray_4  font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-2 focus:ring-inset focus:ring-primary_gray_5"
                {...register("horas", { required: true })}
                min={1}
                step={1}
              />
            </div>
            {errors.horas && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Cupos */}
          <div className="col-span-3 flex flex-col gap-1">
            <FormLabel value={"Cupos"} />
            <div className="w-full h-full ">
              <input
                defaultValue={cupos}
                type="number"
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("cupos", { required: true })}
                min={1}
                step={1}
              />
            </div>
            {errors.cupos && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Modalidad */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Modalidad"} />
            <div className="w-full">
              <ComboBox
                items={listModalidades}
                onSelect={handleSelect}
                hasBeenSelected={true}
                selected={selectedModalidad}
              />
            </div>
            
          </div>

          {/**Ubicación */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Ubicación"} />
            <div className="w-full">
              <input
                type="text"
                defaultValue={ubicacion}
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("ubicacion", { required: true })}
              />
            </div>
            {errors.ubicacion && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Hora_Inicio */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Hora de Inicio"} />
            <div className="w-full">
              <input
                type="time"
                defaultValue={hora_inicio}
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("hora_inicio", { required: true })}
              />
            </div>
            {errors.hora_inicio && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          {/**Duracion */}
          <div className="col-span-6 flex flex-col gap-1">
            <FormLabel value={"Duración"} />
            <div className="w-full">
              <input
                type="number"
                defaultValue={duracion}
                className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                {...register("duracion", { required: true })}
              />
            </div>
            {errors.duracion && (
              <span className="text-red-600 text-sm font-light px-1">
                Ingrese un valor válido
              </span>
            )}
          </div>

          <div className="flex flex-col col-span-12 gap-1">
            <FormLabel value={"Ponentes"} />
            <div className="flex flex-col gap-3">
              {inputs.map((input) => (
                <>
                  <div key={input.id} className="flex flex-row justify-between items-center">
                    <div className="bg-white rounded-lg p-3 border-[1px] flex-grow">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-primary_text_1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-primary_text_1 pt-3">
                            Charla
                          </label>
                          <input
                            type="text"
                            value={input.charla}
                            onChange={(e) => handleCharlaChange(input.id, e.target.value)}
                            className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {input.hasAddButton && (
                        <Button
                          type="ucuenca"
                          onClick={handleAddInput}
                          icon="add"
                          buttonType="button"
                          size="small"
                          isRadial={true}
                          isPrimary={false}
                        />
                      )}
                      {input.hasRemoveButton && inputs.length > 1 && (
                        <Button
                          type="error"
                          onClick={handleRemoveInput}
                          icon="delete"
                          buttonType="button"
                          size="small"
                          isRadial={true}
                          isPrimary={false}
                        />
                      )}
                    </div>
                  </div>
                  {input.isEmpty && (
                    <span className="text-red-600 text-sm font-light px-1">
                      Complete todos los campos para el Ponente
                    </span>
                  )}
                </>
              ))}
            </div>
          </div>

          {/**Footer */}
          <div className="col-span-12 text-primary_gray_5">
            <hr />
          </div>

          {/**Buttons */}
          <div className="flex items-center justify-center col-span-12 gap-4">
            <Button
              type="gray"
              onClick={() => navigate(-1)}
              icon={"left"}
              buttonType={"button"}
              value={"Atrás"}
              size={"medium"}
            />
            <Button
              type="ucuenca"
              icon={"saveEdit"}
              buttonType={"submit"}
              value={"Guardar"}
              size={"medium"}
              isLoading={isUpdating}
              isPrimary={true}
            />
          </div>
        </ContainerForm>
      </form>
    </ContainerPage>
  );
};

export default EditarCharla;
