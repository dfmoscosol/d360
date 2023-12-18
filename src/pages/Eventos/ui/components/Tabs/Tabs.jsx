import React, { useState } from "react";

const Tabs = ({ tabList, activeIndex }) => {
  const [activeTab, setActiveTab] = useState(activeIndex);

  let activeInitialCoontent;
  tabList.map((tab, indexTab) => {
    if (tab.hasTitle) {
      tab.data.map((data, indexData) => {
        if (data.index === activeIndex) {
          activeInitialCoontent = data.content;
        }
      });
    } else {
      if (tab.index === activeIndex) {
        activeInitialCoontent = tab.content;
      }
    }
  });

  const [activeContent, setActiveContent] = useState(activeInitialCoontent);

  const handleTabClick = (index) => {
    setActiveTab(index);
    tabList.map((tab, indexTab) => {
      if (tab.hasTitle) {
        tab.data.map((data, indexData) => {
          if (data.index === index) {
            setActiveContent(data.content);
          }
        });
      } else {
        if (tab.index === index) {
          setActiveContent(tab.content);
        }
      }
    });
  };

  return (
    <div className="rounded-lg w-full">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-2 py-6">
          <div className="flex flex-col w-full gap-2">
            {tabList.map((tab, indexTab) => (
              <div key={indexTab}>
                {tab.hasTitle ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-primary_gray_3">
                      {tab.title}
                    </span>
                    <div className="flex flex-col gap-0">
                      {tab.data.map((data, index) => (
                        <button
                          key={data.index}
                          className={`${
                            data.index === activeTab
                              ? "text-primary_color_1 font-medium bg-primary_gray_1 rounded-lg"
                              : "text-primary_gray_2 font-normal"
                          } py-1 px-2 flex items-center gap-2 w-full text-sm`}
                          onClick={() => handleTabClick(data.index)}
                        >
                          {data.icon}
                          {data.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={tab.index}
                    className={`${
                      tab.index === activeTab
                        ? "text-primary_color_1 font-medium bg-primary_gray_1 rounded-lg"
                        : "text-primary_gray_2 font-normal"
                    } p-2 flex items-center gap-2 w-full text-sm`}
                    onClick={() => handleTabClick(tab.index)}
                  >
                    {tab.icon}
                    {tab.title}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 md:col-span-10 w-full">
          <div className="rounded-xl transition-all duration-300">
            {/**{tabList[activeTab].content} */}
            {activeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
