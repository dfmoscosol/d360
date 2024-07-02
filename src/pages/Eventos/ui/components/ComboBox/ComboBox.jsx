import React, { useState, useEffect } from "react";
import { MdExpandMore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const ComboBox = ({ items, indexGeneral,onSelect, selected = "", isEnabled = true, enableEdit = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selected);

  useEffect(() => {
    setSelectedItem(selected); // Esto asegura que el valor externo se refleje internamente
  }, [selected]);

  const toggleComboBox = () => {
    if (isEnabled) setIsVisible(!isVisible);
  };

  const handleSelectItem = (item) => {
    if (isEnabled) {
      setSelectedItem(item);
      setIsVisible(false);
      onSelect(item,indexGeneral);
    }
  };

  const comboBoxVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.1 },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.9,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="relative">
      <div className={`flex items-center rounded-lg text-sm w-full relative cursor-pointer ${!isEnabled ? 'cursor-not-allowed' : ''}`}>
        <input
          type="text"
          className={`cursor-pointer focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full ${
            enableEdit ? "outline-none ring-1 ring-inset ring-primary_gray_5" : "bg-primary_gray_1"
          }`}
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          onClick={toggleComboBox}
          readOnly={!enableEdit}
          placeholder="Seleccionar..."
          disabled={!isEnabled}
        />
        <MdExpandMore
          size={30}
          className={`absolute right-0 text-primary_color_1 ${!isEnabled ? 'opacity-50' : ''}`}
          onClick={toggleComboBox}
        />
      </div>

      <AnimatePresence>
        {isVisible && isEnabled && (
          <motion.div
            className="absolute z-10 w-full bg-white shadow-lg mt-1 p-4 rounded-lg border border-primary_gray_5"
            variants={comboBoxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="p-2 text-sm hover:bg-primary_gray_1 rounded-lg cursor-pointer text-primary_gray_4"
                onClick={() => handleSelectItem(item)}
              >
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComboBox;
