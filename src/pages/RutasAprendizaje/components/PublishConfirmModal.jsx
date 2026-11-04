/* eslint-disable react/prop-types */
import { useState } from "react";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";

const PublishConfirmModal = ({
  totalBlocks,
  totalDuration,
  docente,
  isSaving,
  errorMessage,
  onClose,
  onConfirm,
}) => {
  const [observaciones, setObservaciones] = useState("");

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <HiOutlineCheck className="text-xl" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-800">
                Validar y Publicar Ruta
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Esta acción actualizará la ruta formativa de{" "}
                <strong className="text-slate-700">{docente}</strong> con el itinerario curado.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              {errorMessage}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-slate-400 block text-[10px]">Recursos</span>
              <span className="font-bold text-slate-800 text-xs">
                {totalBlocks} {totalBlocks === 1 ? "bloque" : "bloques"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Dedicación Total</span>
              <span className="font-bold text-slate-800 text-xs">{totalDuration}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Persistencia DB</span>
              <span className="font-bold text-emerald-600 text-xs">Upsert Atómico</span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Observaciones de la Validación (Opcional)
            </label>
            <textarea
              rows="3"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Comentarios o recomendaciones institucionales de la Dirección de Innovación Educativa..."
              className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary_color_1 resize-none text-slate-800"
            />
          </div>

          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-700 flex items-center gap-2">
            <span>ℹ️</span>
            <span>
              La ruta pasará a estado <strong>Validada</strong> y el docente podrá visualizar sus recursos en EduVoz360.
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 bg-slate-50 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition disabled:opacity-50"
          >
            Volver a Editar
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ observaciones, esBorrador: false })}
            disabled={isSaving || totalBlocks === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Guardando...
              </>
            ) : (
              "Confirmar Validación"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;
