import React, { useState } from "react";

const Tabs = ({ tabList, activeIndex }) => {
  const [activeTab, setActiveTab] = useState(activeIndex);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="rounded-lg w-full">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-2 py-6">
          <div className="flex flex-col w-full gap-2">
            {tabList.map((tab, index) => (
              <button
                key={index}
                className={`${
                  index === activeTab
                    ? "text-primary_color_1 font-medium bg-primary_gray_1 rounded-lg"
                    : "text-primary_gray_2 font-normal"
                } p-2 flex items-center gap-2 w-full text-sm`}
                onClick={() => handleTabClick(index)}
              >
                {tab.icon}
                {tab.title}
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-12 md:col-span-10 w-full">
          <div className="rounded-xl transition-all duration-300">
            {tabList[activeTab].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
