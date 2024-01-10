import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";

const ComboBox = ({ items, onSelect, hasBeenSelected, selected }) => {
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

  return (
    <div className="relative">
      <div className="flex items-center rounded-lg text-sm w-full relative cursor-pointer">
        <input
          type="text"
          className="cursor-pointer focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1  outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          onClick={toggleComboBox}
          readOnly
          placeholder="Seleccionar..."
        />
        <MdExpandMore
          size={30}
          className="absolute right-0 text-primary_color_1"
          onClick={toggleComboBox}
        />
      </div>

      {isVisible && (
        <div className="absolute z-10 w-full bg-white shadow-lg mt-1 p-4 rounded-lg">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-2 text-sm hover:bg-primary_gray_1 rounded-lg cursor-pointer text-primary_gray_4"
              onClick={() => handleSelectItem(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
