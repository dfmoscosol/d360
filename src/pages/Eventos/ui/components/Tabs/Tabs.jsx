import React, { useState } from "react";

const Tabs = ({ tabList, activeIndex }) => {
  console.log(tabList);

  const [activeTab, setActiveTab] = useState(activeIndex);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="rounded-lg w-full">
      <div className="flex flex-col items-center justify-start md:flex-row w-full gap-2 p-4 bg-white rounded-lg">
        {tabList.map((tab, index) => (
          <button
            key={index}
            className={`${
              index === activeTab ? "bg-primary_gray_1 text-primary_color_1" : "text-primary_gray_2"
            } font-medium p-2 flex items-center gap-2 w-full sm:w-auto rounded-lg text-sm`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-xl transition-all duration-300 ">
        {tabList[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
