import React from "react";

import { ToggleSwitch, HorizontalPill } from "@components";
import { Oval } from "react-loader-spinner";

// Header subcomponent
export const Header = ({ color, title, icon, subTitle, hasIcon, children }) => (
  <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-4">
    <div className="flex gap-2 items-center">
      
      {hasIcon && <div className={`${color} p-2 rounded-lg`}>{icon}</div>}
      <div className="flex flex-col">
        <span className="font-medium text-xl text-primary_text_1">
          {title}
        </span>
        <span className="font-normal text-sm text-primary_gray_2">
          {subTitle}
        </span>
      </div> {/***/}
    </div>
    {children}
  </div>
);

// Title subcomponent
export const Title = ({ value }) => (
  <span className="font-medium text-3xl text-primary_text_1 py-6">
    {value}
  </span>
);

// Info subcomponent
export const Info = ({ children }) => (
  <div className="flex gap-2 flex-wrap">{children}</div>
);

// Data subcomponent
export const Data = ({ dataList }) => (
  <div className="flex flex-col mt-4">
    {dataList.map((data, index) => (
      <div className="grid grid-cols-4 w-full" key={index}>
        <span className="col-span-2 md:col-span-1 text-base font-normal text-primary_gray_2">
          {data.key}
        </span>
        <span className="col-span-2 text-base font-medium text-primary_text_1">
          {data.value}
        </span>
      </div>
    ))}
  </div>
);

// Info subcomponent
export const Footer = ({ children }) => (
  <div className="flex flex-col gap-2 w-full justify-between flex-wrap md:flex-nowrap mt-10">
    {children}
  </div>
);

// Title Paner subcomponent
export const TitlePanel = ({ value }) => (
  <span className="text-lg font-medium text-primary_color_1">{value}</span>
);

// Title Paner subcomponent
export const Activator = ({
  isActivatorActive,
  value,
  handleTogle,
  isLoading,
}) => (
  <div
    className={`flex items-center justify-between ${
      isActivatorActive
        ? "bg-green-100 text-green-600"
        : "bg-primary_gray_1 text-primary_gray_4"
    }  px-4 py-2 rounded-lg ${isLoading ? "animate-pulse" : "animate-none"}`}
  >
    <span className="font-medium text-sm ">{value}</span>
    {isLoading ? (
      <Oval
        height={24}
        width={24}
        color={"#15803d"}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#94a3b8"
        strokeWidth={8}
        strokeWidthSecondary={10}
      />
    ) : (
      <div>
        <ToggleSwitch
          onToggle={(isActive) => handleTogle(isActive)}
          initialState={isActivatorActive}
        />
      </div>
    )}
  </div>
);

// Title SubTitle subcomponent
export const SubTitle = ({ extra, value }) => (
  <span
    className={`font-medium text-primary_gray_4 mt-6 mb-2 text-lg ${extra}`}
  >
    {value}
  </span>
);

// Title SubTitle subcomponent
export const TogglePanel = ({ toggles }) => (
  <div className="grid grid-cols-4 gap-2">
    {toggles.map((toggle, index) => (
      <div className="col-span-4 md:col-span-1" key={index}>
        {toggle}
      </div>
    ))}
  </div>
);

// SectionContainer subcomponent
export const SectionContainer = ({ extra, children }) => (
  <div
    className={`flex flex-col rounded-lg p-4 border border-primary_gray_5 mt-4 ${extra}`}
  >
    {children}
  </div>
);

export const TalleresPanel = ({ extra, talleresList }) => (
  <div className={`${extra}`}>
    <div className="grid grid-cols-3 gap-4">
      {talleresList.map((taller, index) => (
        <div
          className="col-span-3 md:col-span-1 bg-primary_gray_1 rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200 justify-between"
          key={index}
        >
          <div className="flex items-center justify-end">
            <span className="text-sm font-medium text-primary_text_1">
              Taller {index + 1}
            </span>
          </div>

          <span className="text-sm font-medium text-primary_gray_4">
            {taller.nombre}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
              <span className="text-sm font-normal text-primary_gray_2">
                Inscritos
              </span>
              <span className="text-base font-medium text-primary_text_1">
                {taller.docentes_inscritos.length}
              </span>
            </div>
            <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
              <span className="text-sm font-normal text-primary_gray_2">
                Por Aprobar
              </span>
              <span className="text-base font-medium text-primary_text_1">
                {taller.docentes_pendientes.length}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EventoView = ({ extra, children }) => (
  <div className={`flex flex-col w-full bg-white rounded-lg  md:p-6 ${extra}`}>
    {children}
  </div>
);

export default EventoView;
