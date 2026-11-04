/* eslint-disable react/prop-types */
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

const CreateResourceModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "curso",
    author: "Dirección de Innovación Educativa (DIE)",
    url: "",
    durationMin: 45,
    level: "Intermedio",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "El título es obligatorio";
    }
    const cleanUrl = formData.url.trim();
    if (!cleanUrl) {
      errs.url = "La URL del recurso es obligatoria";
    } else if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      errs.url = "La URL debe comenzar con http:// o https://";
    }
    if (!formData.description.trim()) {
      errs.description = "La descripción es obligatoria";
    }
    const dur = Number(formData.durationMin);
    if (isNaN(dur) || dur <= 0) {
      errs.durationMin = "La duración debe ser mayor a 0 minutos";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newResource = {
      id: `custom-res-${Date.now()}`,
      title: formData.title.trim(),
      type: formData.type,
      author: formData.author.trim() || "Dirección de Innovación Educativa (DIE)",
      url: formData.url.trim(),
      durationMin: Number(formData.durationMin),
      level: formData.level,
      description: formData.description.trim(),
      match: "100% Curado por Experto",
      origen: "experto_d360",
    };

    onCreate(newResource);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="font-bold text-sm text-slate-800">
              Agregar Nuevo Recurso a la Ruta
            </h2>
            <p className="text-[11px] text-slate-500">
              Completa la información pedagógica del nuevo nodo formativo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition"
            title="Cerrar"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Título */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Título del Recurso *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Taller Práctico de Microcredenciales"
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary_color_1 outline-none text-slate-800"
            />
            {errors.title && (
              <span className="text-rose-500 text-[10px] mt-0.5 block">
                {errors.title}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tipo */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Formato / Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary_color_1 outline-none bg-white text-slate-800 cursor-pointer"
              >
                <option value="video">Video</option>
                <option value="libro">Libro / Lectura</option>
                <option value="curso">Curso Completo</option>
                <option value="practica">Taller Práctico</option>
              </select>
            </div>

            {/* Duración */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Duración (Minutos) *
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={formData.durationMin}
                onChange={(e) =>
                  setFormData({ ...formData, durationMin: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary_color_1 outline-none text-slate-800"
              />
              {errors.durationMin && (
                <span className="text-rose-500 text-[10px] mt-0.5 block">
                  {errors.durationMin}
                </span>
              )}
            </div>
          </div>

          {/* Proveedor / Autor */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Autor / Proveedor
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Ej: Dirección de Innovación Educativa, UNESCO, etc."
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary_color_1 outline-none text-slate-800"
            />
          </div>

          {/* URL */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              URL de Acceso *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://campus.ucuenca.edu.ec/..."
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary_color_1 outline-none text-slate-800"
            />
            {errors.url && (
              <span className="text-rose-500 text-[10px] mt-0.5 block">
                {errors.url}
              </span>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Descripción / Objetivo Pedagógico *
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Explica qué competencia o brecha aborda este recurso..."
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-primary_color_1 outline-none resize-none text-slate-800"
            />
            {errors.description && (
              <span className="text-rose-500 text-[10px] mt-0.5 block">
                {errors.description}
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary_color_1 text-white font-semibold rounded-xl hover:bg-[#001D3D] shadow-sm transition"
            >
              Crear e Insertar en Ruta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResourceModal;
