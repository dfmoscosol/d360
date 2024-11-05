import React, { useState, useEffect } from "react";
import { MdExpandMore, MdFilterList } from "react-icons/md"; // Import the filter icon
import { motion, AnimatePresence } from "framer-motion";

const FilterSelect = ({ items, indexGeneral, onSelect, selected = "", isEnabled = true, enableEdit = false, height }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selected);

  useEffect(() => {
    setSelectedItem(selected); // Ensure that the external value is reflected internally
  }, [selected]);

  const toggleFilterSelect = () => {
    if (isEnabled) setIsVisible(!isVisible);
  };

  const handleSelectItem = (item) => {
    if (isEnabled) {
      setSelectedItem(item);
      setIsVisible(false);
      onSelect(item, indexGeneral);
    }
  };

  const FilterSelectVariants = {
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
    <div className={`relative w-full ${height || "h-auto"}`}> 
      <div
        className={`flex items-center rounded-lg text-sm w-full relative cursor-pointer bg-white border border-gray-300 p-2 shadow-sm 
        ${!isEnabled ? 'cursor-not-allowed' : 'hover:shadow-md'} transition-all duration-150 ${height}`}
        onClick={toggleFilterSelect}
      >
        <MdFilterList size={20} className="text-gray-600 mr-2" /> {/* Left Icon */}
        <input
          type="text"
          className={`flex-grow cursor-pointer focus:bg-white text-gray-800 font-medium p-1 text-sm w-full bg-white outline-none 
          ${enableEdit ? "ring-1 ring-inset ring-gray-300" : ""}`}
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          readOnly={!enableEdit}
          placeholder="Select an option..."
          disabled={!isEnabled}
        />
        <MdExpandMore
          size={20}
          className={`text-gray-600 ${!isEnabled ? 'opacity-50' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isVisible && isEnabled && (
          <motion.div
            className="absolute z-10 w-full bg-white shadow-lg mt-1 p-2 rounded-lg border border-gray-300"
            variants={FilterSelectVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="p-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer text-gray-700"
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

export default FilterSelect;
