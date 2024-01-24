import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const KeywordComboBox = ({ items, onSelect, hasBeenSelected, selected }) => {
  const [isVisible, setIsVisible] = useState(false);

  let selectedItemProp = "";
  if (hasBeenSelected) {
    selectedItemProp = selected;
  }

  const [selectedItem, setSelectedItem] = useState(selectedItemProp);

  const toggleComboBox = () => setIsVisible(!isVisible);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsVisible(false);
    onSelect(item);
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
      <div className="flex items-center rounded-lg text-sm w-full relative">
        <input
          type="text"
          className="cursor-pointer focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          onClick={toggleComboBox}
          readOnly
          placeholder="Selecciona una opción"
        />
        <MdExpandMore
          size={30}
          className="absolute right-0 text-primary_color_1"
          onClick={toggleComboBox}
        />
      </div>

      <AnimatePresence>
        {isVisible && (
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

export default KeywordComboBox;
