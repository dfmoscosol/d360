import React, { useState, useRef } from "react";
import { MdCloudUpload, MdClose, MdCheckCircle, MdCancel, MdWarning, MdRepeat } from "react-icons/md";
import { useValidarInscripcionMasivaMutation } from "@redux/services/evento/eventoApi";

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

  // Detectar encabezado: si la primera celda NO es un correo válido, es encabezado
  if (!EMAIL_REGEX.test(rows[0][0])) {
    const headerStr = rows[0][0].toLowerCase().replace(/\s/g, "");
    const isKnownEmailHeader = CORREO_HEADERS.some((h) => h.replace(/\s/g, "") === headerStr);
    if (!isKnownEmailHeader) {
      return {
        error: `El encabezado debe ser un correo o una etiqueta válida de correo. Se encontró: "${rows[0][0]}".`,
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

const BADGE_CONFIG = {
  VALIDO: {
    label: "Válido",
    color: "bg-green-100 text-green-800",
    icon: <MdCheckCircle className="text-green-600" size={14} />,
  },
  YA_INSCRITO: {
    label: "Ya inscrito",
    color: "bg-yellow-100 text-yellow-800",
    icon: <MdWarning className="text-yellow-600" size={14} />,
  },
  NO_REGISTRADO: {
    label: "No registrado",
    color: "bg-red-100 text-red-800",
    icon: <MdCancel className="text-red-600" size={14} />,
  },
  REPETIDO_ARCHIVO: {
    label: "Duplicado",
    color: "bg-gray-100 text-gray-600",
    icon: <MdRepeat className="text-gray-500" size={14} />,
  },
};

const CargaMasivaModal = ({ isOpen, onClose, eventoId, tallerId, onValidosAdded }) => {
  const fileInputRef = useRef(null);
  const [parseError, setParseError] = useState(null);
  const [report, setReport] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [validarMasiva, { isLoading }] = useValidarInscripcionMasivaMutation();

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

    // Validación local solo para CSV
    if (isCSV) {
      const text = await file.text();
      const result = parseCsvText(text);
      if (result.error) {
        setParseError(result.error);
        return;
      }
    }

    try {
      const response = await validarMasiva({ eventoId, tallerId, file }).unwrap();
      setReport(response);
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

  const handleAddToCart = () => {
    if (report?.uids_validos?.length > 0) {
      onValidosAdded(report.uids_validos);
    }
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
            <h2 className="text-base font-semibold text-primary_text_1">Carga Masiva de Docentes</h2>
          </div>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <MdClose size={20} className="text-primary_gray_3" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Drop Zone */}
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
                  {isLoading ? "Validando archivo..." : "Arrastra tu archivo aquí"}
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

          {/* Hint de formato */}
          {!report && !parseError && (
            <p className="text-xs text-primary_gray_2 text-center">
              Debe tener <span className="font-medium text-primary_text_1">1 sola columna</span> con el Correo electrónico. El encabezado es opcional.
            </p>
          )}

          {/* Error de validación */}
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

          {/* Reporte del backend */}
          {report && (
            <>
              {/* Resumen */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-green-50 rounded-lg py-2 px-1">
                  <p className="text-lg font-bold text-green-700">{report.resumen?.cargados_validos ?? 0}</p>
                  <p className="text-xs text-green-600">Válidos</p>
                </div>
                <div className="bg-yellow-50 rounded-lg py-2 px-1">
                  <p className="text-lg font-bold text-yellow-600">{report.resumen?.ya_inscritos ?? 0}</p>
                  <p className="text-xs text-yellow-500">Ya inscritos</p>
                </div>
                <div className="bg-red-50 rounded-lg py-2 px-1">
                  <p className="text-lg font-bold text-red-600">{report.resumen?.no_registrados ?? 0}</p>
                  <p className="text-xs text-red-500">No registrados</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2 px-1">
                  <p className="text-lg font-bold text-gray-600">{report.resumen?.repetidos_archivo ?? 0}</p>
                  <p className="text-xs text-gray-400">Duplicados</p>
                </div>
              </div>

              {/* Listado por docente */}
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
                {report.detalle?.map((item, idx) => {
                  const badge = BADGE_CONFIG[item.estado] || BADGE_CONFIG.NO_REGISTRADO;
                  return (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col min-w-0 mr-2">
                        <span className="text-sm font-medium text-primary_text_1 truncate">{item.nombre}</span>
                        <span className="text-xs text-primary_gray_2 truncate">{item.email}</span>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.color}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button onClick={resetState} className="text-xs text-primary_gray_3 hover:text-primary_color_1 font-medium underline text-center transition-colors">
                Subir otro archivo
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {report && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-primary_gray_3 hover:text-primary_text_1 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleAddToCart}
              disabled={(report?.uids_validos?.length ?? 0) === 0}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary_color_1 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              Añadir {report?.uids_validos?.length ?? 0} válido(s) para inscribir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargaMasivaModal;
