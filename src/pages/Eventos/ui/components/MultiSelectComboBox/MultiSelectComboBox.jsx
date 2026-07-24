import React, { useState, useRef, useEffect } from "react";
import { MdExpandMore, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const MultiSelectComboBox = ({
  items = [],
  selectedItems = [],
  onSelectionChange,
  isEnabled = true,
  placeholder = "Seleccionar...",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (isEnabled) setIsVisible(!isVisible);
  };

  const handleToggleItem = (item) => {
    if (!isEnabled) return;
    const isSelected = selectedItems.some((s) => s.id === item.id);
    const updated = isSelected
      ? selectedItems.filter((s) => s.id !== item.id)
      : [...selectedItems, item];
    onSelectionChange(updated);
  };

  const handleRemoveItem = (item) => {
    if (!isEnabled) return;
    onSelectionChange(selectedItems.filter((s) => s.id !== item.id));
  };

  const comboBoxVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.1 } },
  };

  const displayText = selectedItems.length > 0
    ? `${selectedItems.length} seleccionada(s)`
    : "";

  return (
    <div className="relative" ref={containerRef}>
      {/* Input */}
      <div
        className={`flex items-center rounded-lg text-sm w-full relative cursor-pointer ${
          !isEnabled ? "cursor-not-allowed" : ""
        }`}
      >
        <input
          type="text"
          className="cursor-pointer focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none"
          value={displayText}
          readOnly
          onClick={toggleDropdown}
          placeholder={placeholder}
          disabled={!isEnabled}
        />
        <MdExpandMore
          size={30}
          className={`absolute right-0 text-primary_color_1 ${
            !isEnabled ? "opacity-50" : ""
          }`}
          onClick={toggleDropdown}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isVisible && isEnabled && (
          <motion.div
            className="absolute z-10 w-full bg-white shadow-lg mt-1 p-2 rounded-lg border border-primary_gray_5 max-h-48 overflow-y-auto"
            variants={comboBoxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item) => {
              const isSelected = selectedItems.some((s) => s.id === item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 text-sm rounded-lg cursor-pointer text-primary_gray_4 ${
                    isSelected
                      ? "bg-primary_color_1/10 font-medium"
                      : "hover:bg-primary_gray_1"
                  }`}
                  onClick={() => handleToggleItem(item)}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "bg-primary_color_1 border-primary_color_1"
                        : "border-primary_gray_5"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{item.nombre}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chips */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary_color_1/10 text-primary_color_1 text-xs font-medium"
            >
              {item.nombre}
              {isEnabled && (
                <MdClose
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => handleRemoveItem(item)}
                />
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectComboBox;
