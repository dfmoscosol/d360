import React, { useState, useRef } from "react";
import { MdCloudUpload, MdClose, MdCancel } from "react-icons/md";
import { useCargaMasivaGraduadosMutation } from "../../redux/services/reportes/reportesApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CORREO_HEADERS = ["correo", "email", "e-mail", "correo electrónico", "correo electronico"];

function parseCsvText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { error: "El archivo está vacío." };

  const separator = lines[0].includes(";") ? ";" : ",";
  const rows = lines.map((line) => line.split(separator).map((c) => c.trim()));

  const invalidRow = rows.find((r) => r.length !== 1);
  if (invalidRow) {
    return { error: "El archivo debe tener exactamente 1 sola columna (Correo electrónico)." };
  }

  let dataRows = rows;

  if (!EMAIL_REGEX.test(rows[0][0])) {
    const headerStr = rows[0][0].toLowerCase().replace(/\s/g, "");
    const isKnownEmailHeader = CORREO_HEADERS.some((h) => h.replace(/\s/g, "") === headerStr);
    if (!isKnownEmailHeader) {
      return {
        error: `El encabezado debe ser un correo o una etiqueta válida. Se encontró: "${rows[0][0]}".`,
      };
    }
    dataRows = rows.slice(1);
  }

  if (dataRows.length === 0) return { error: "El archivo no contiene datos (solo encabezado)." };

  const invalidEmails = dataRows.filter((r) => !EMAIL_REGEX.test(r[0]));
  if (invalidEmails.length > 0) {
    return {
      error: `Correos con formato inválido: ${invalidEmails.map((r) => r[0]).slice(0, 3).join(", ")}${invalidEmails.length > 3 ? "..." : ""}`,
    };
  }

  return { rows: dataRows.map((r) => ({ correo: r[0] })) };
}

const CargaMasivaGraduadosModal = ({ isOpen, onClose, onSuccess }) => {
  const fileInputRef = useRef(null);
  const [parseError, setParseError] = useState(null);
  const [report, setReport] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [cargaMasiva, { isLoading }] = useCargaMasivaGraduadosMutation();

  const resetState = () => {
    setParseError(null);
    setReport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const processFile = async (file) => {
    setParseError(null);
    setReport(null);

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isXLSX = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (!isCSV && !isXLSX) {
      setParseError("Solo se aceptan archivos .csv o .xlsx");
      return;
    }

    if (isCSV) {
      const text = await file.text();
      const result = parseCsvText(text);
      if (result.error) {
        setParseError(result.error);
        return;
      }
    }

    try {
      const response = await cargaMasiva(file).unwrap();
      setReport(response.respuesta);
    } catch (err) {
      setParseError(err?.data?.error || "Error al validar el archivo con el servidor.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MdCloudUpload size={22} className="text-primary_color_1" />
            <h2 className="text-base font-semibold text-primary_text_1">Carga Masiva de Graduados</h2>
          </div>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <MdClose size={20} className="text-primary_gray_3" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {!report && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 gap-3 cursor-pointer transition-all duration-200
                ${isDragging ? "border-primary_color_1 bg-blue-50" : "border-gray-200 hover:border-primary_color_1 hover:bg-gray-50"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <MdCloudUpload size={38} className={isDragging ? "text-primary_color_1" : "text-primary_gray_3"} />
              <div className="text-center">
                <p className="text-sm font-medium text-primary_text_1">
                  {isLoading ? "Subiendo archivo..." : "Arrastra tu archivo aquí"}
                </p>
                <p className="text-xs text-primary_gray_2 mt-1">
                  o <span className="text-primary_color_1 font-medium">haz clic para buscar</span>
                </p>
                <p className="text-xs text-primary_gray_4 mt-2">Formatos aceptados: .csv, .xlsx</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {!report && !parseError && (
            <p className="text-xs text-primary_gray_2 text-center">
              Debe tener <span className="font-medium text-primary_text_1">1 sola columna</span> con el Correo electrónico. El encabezado es opcional.
            </p>
          )}

          {parseError && (
            <>
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <MdCancel size={18} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{parseError}</p>
              </div>
              <button onClick={resetState} className="text-sm text-primary_color_1 font-medium underline text-center">
                Intentar con otro archivo
              </button>
            </>
          )}

          {report && (
            <>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 rounded-lg py-4 px-2">
                  <p className="text-2xl font-bold text-green-700">{report.resumen?.cargados_validos ?? 0}</p>
                  <p className="text-sm text-green-600 mt-1">Actualizados</p>
                </div>
                <div className="bg-red-50 rounded-lg py-4 px-2">
                  <p className="text-2xl font-bold text-red-600">{report.resumen?.no_registrados ?? 0}</p>
                  <p className="text-sm text-red-500 mt-1">No encontrados</p>
                </div>
              </div>
              <button onClick={resetState} className="text-xs text-primary_gray_3 hover:text-primary_color_1 font-medium underline text-center transition-colors mt-2">
                Subir otro archivo
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {report && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleSuccess}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary_color_1 hover:bg-blue-700 transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargaMasivaGraduadosModal;
