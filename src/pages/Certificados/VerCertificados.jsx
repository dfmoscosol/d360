import React, { useEffect, useState } from "react";
import { ContainerPage, Modal, Loader, Button } from "@components";
import CertificadoCard from "./Components/CertificadoCard";
import FilterSelect from "../Eventos/ui/components/FilterSelect/FilterSelect";
import FormLabel from "../Eventos/ui/components/FormLabel/FormLabel";
import { MdOutlineSearch } from "react-icons/md";
import {
  useGetAllParametersQuery,
  useUpdateParametersMutation,
} from "../../redux/services/certificado/certificadoApi";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@redux/features/notification/notificationSlice";
import ContainerFormModal from "../Eventos/ui/components/ContainerFormModal/ContainerFormModal";

const VerCertificados = ({ certificados, handleRefetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [horas_programa, setHorasPrograma] = useState("");
  const [porcentaje_programa, setPorcentajePrograma] = useState("");
  const [porcentaje_certificado, setPorcentajeCertificado] = useState("");
  const [errors, setErrors] = useState({});

  // Initialize dispatch for notifications
  const dispatch = useDispatch();

  // Mutation hook for updating parameters
  const [
    updateParameters,
    { data: response, isLoading: isUpdating, isSuccess, isError, error },
  ] = useUpdateParametersMutation();

  // Define the filter options
  const filterOptions = ["Todos", "Aprobados", "Pendientes", "Rechazados"];

  // Filter the certificados based on filterValue and searchTerm
  const filteredCertificados = certificados.filter((certificado) => {
    let matchFilter = true;
    if (filterValue === "Aprobados") {
      matchFilter = certificado.aceptada === true;
    } else if (filterValue === "Pendientes") {
      matchFilter = certificado.aceptada === null;
    } else if (filterValue === "Rechazados") {
      matchFilter = certificado.aceptada === false;
    }

    let matchSearch = true;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      matchSearch = (certificado.nombres && certificado.nombres.toLowerCase().includes(lowerSearch)) ||
                    (certificado.correo && certificado.correo.toLowerCase().includes(lowerSearch));
    }

    return matchFilter && matchSearch;
  }).sort((a, b) => {
    // Prioridad a pendientes (aceptada === null)
    if (a.aceptada === null && b.aceptada !== null) return -1;
    if (a.aceptada !== null && b.aceptada === null) return 1;

    // Luego por fecha (los más recientes primero)
    if (a.fecha_creacion && b.fecha_creacion) {
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    }
    return 0;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const {
    data: parameterData,
    error: parameterError,
    isLoading: isParameterLoading,
    isFetching: isParameterFetching,
    isError: isParameterError,
    refetch: refetchParameters, 
  } = useGetAllParametersQuery();

  // Initialize form fields with fetched data
  useEffect(() => {
    if (parameterData && parameterData.respuesta.parametros) {
      const defaultValues = {};
      parameterData.respuesta.parametros.forEach((param) => {
        defaultValues[param.nombre_parametro] = param.valor;
      });
      setHorasPrograma(defaultValues["horas_programa"] || "");
      setPorcentajePrograma(defaultValues["porcentaje_programa"] || "");
      setPorcentajeCertificado(defaultValues["porcentaje_certificado"] || "");
    }
  }, [parameterData]);

  // Handle form submission
  const onSubmit = async (event) => {
    event.preventDefault();

    const data = {
      horas_programa,
      porcentaje_programa,
      porcentaje_certificado,
    };

    let hasError = false;
    const validationErrors = {};

    if (!horas_programa) {
      validationErrors.horas_programa = "Ingrese un valor válido";
      hasError = true;
    }

    if (!porcentaje_programa) {
      validationErrors.porcentaje_programa = "Ingrese un valor válido";
      hasError = true;
    } else if (porcentaje_programa > 1) {
      validationErrors.porcentaje_programa = "Ingrese un valor entre 0 y 1";
      hasError = true;
    }

    if (!porcentaje_certificado) {
      validationErrors.porcentaje_certificado = "Ingrese un valor válido";
      hasError = true;
    } else if (porcentaje_certificado > 1) {
      validationErrors.porcentaje_certificado = "Ingrese un valor entre 0 y 1";
      hasError = true;
    }

    setErrors(validationErrors);

    if (hasError) {
      return;
    }

    const parametersToUpdate = Object.entries(data).map(
      ([nombre_parametro, valor]) => ({
        nombre_parametro,
        valor: parseFloat(valor),
      })
    );

    try {
      await updateParameters({ parametros: parametersToUpdate }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  // Effect to handle success or error after mutation
  useEffect(() => {
    if (isSuccess) {
      triggerNotification(dispatch, {
        message: response.respuesta || "Parámetros actualizados correctamente",
        type: "success",
      });
      refetchParameters(); // Vuelve a obtener los datos actualizados
      handleCloseModal();
    } else if (isError && error) {
      triggerNotification(dispatch, {
        message: error.data.error || "Error al actualizar parámetros",
        type: "error",
      });
    }
  }, [isSuccess, isError, error, dispatch]);

  return (
    <ContainerPage>
      {/* Filter UI */}
      <div className="mb-4 flex flex-col md:flex-row justify-between w-full gap-4">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MdOutlineSearch className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-primary_gray_5 focus:border-primary_gray_5 outline-none"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="w-40">
            <Button
             type="gray"
             icon={"settings"}
             onClick={() => handleOpenModal()}
             value={"Configuración"}
             size={"medium"}
             isLoading={isUpdating}
             isPrimary={true}
             height='h-10'
            />
          </div>
          <div className="w-40">
            <FilterSelect
              items={filterOptions}
              selected={filterValue}
              onSelect={(item) => setFilterValue(item)}
              isEnabled={true}
              enableEdit={false}
              height='h-10'
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-end w-full">
        <span className="text-sm font-medium text-primary_text_1">
          {filteredCertificados.length} certificados
        </span>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        {filteredCertificados.map((certificado, index) => (
          <CertificadoCard
            key={index}
            nombreCurso={certificado.nombre_curso}
            nombres={certificado.nombres}
            correo={certificado.correo}
            horas_acredita={certificado.horas_acredita}
            horas_certificado={certificado.horas_certificado}
            institucion={certificado.institucion}
            fechaCreacion={certificado.fecha_creacion}
            idCertificado={certificado.id}
            isApproved={certificado.aceptada}
            handleRefetch={handleRefetch}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Configuración de Parámetros"
        type="form"
      >
        {isParameterLoading || isParameterFetching ? (
          <Loader />
        ) : isParameterError ? (
          <FetchError error={parameterError} />
        ) : (
          <form onSubmit={onSubmit}>
            <ContainerFormModal>
              {/* Horas del programa */}
              <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
                <FormLabel value={"Horas del programa"} />
                <input
                  type="number"
                  className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                  value={horas_programa}
                  onChange={(e) => setHorasPrograma(e.target.value)}
                />
                {errors.horas_programa && (
                  <span className="text-red-600 text-sm font-light px-1">
                    {errors.horas_programa}
                  </span>
                )}
              </div>

              {/* Porcentaje de Acreditación */}
              <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
                <FormLabel value={"Porcentaje de Acreditación"} />
                <input
                  type="number"
                  step="0.01"
                  className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                  value={porcentaje_programa}
                  onChange={(e) => setPorcentajePrograma(e.target.value)}
                />
                {errors.porcentaje_programa && (
                  <span className="text-red-600 text-sm font-light px-1">
                    {errors.porcentaje_programa}
                  </span>
                )}
              </div>

              {/* Porcentaje de los certificados */}
              <div className="md:col-span-12 col-span-12 flex flex-col gap-1">
                <FormLabel value={"Porcentaje de los certificados"} />
                <input
                  type="number"
                  step="0.01"
                  className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                  value={porcentaje_certificado}
                  onChange={(e) => setPorcentajeCertificado(e.target.value)}
                />
                {errors.porcentaje_certificado && (
                  <span className="text-red-600 text-sm font-light px-1">
                    {errors.porcentaje_certificado}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center col-span-12 gap-4">
                <Button
                  type="ucuenca"
                  icon={"save"}
                  buttonType={"submit"}
                  value={"Guardar"}
                  size={"medium"}
                  isLoading={isUpdating}
                  isPrimary={true}
                />
                <Button
                  type="error"
                  onClick={() => handleCloseModal()}
                  icon={"close"}
                  value={"Cancelar"}
                  buttonType={"button"}
                  size={"medium"}
                  isPrimary={true}
                />
              </div>
            </ContainerFormModal>
          </form>
        )}
      </Modal>
    </ContainerPage>
  );
};

export default VerCertificados;
