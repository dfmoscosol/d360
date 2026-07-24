import React from "react";

import { ToggleSwitch, CarouselComponent, InfoPill } from "@components";
import { Oval } from "react-loader-spinner";
import { MdComputer, MdContentPasteSearch, MdHelpOutline, MdOutlineEngineering, MdOutlineGroups, MdSchool } from 'react-icons/md'; // Importa el ícono de react-icons


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
  <span className="font-medium text-3xl text-primary_text_1 py-3">
    {value}
  </span>
);

// Title subcomponent
export const TitleTaller = ({ value }) => (
  <span className="font-medium text-xl text-primary_text_1 py-3">
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
        {
          data.key == "Descripción" ?
            <span className="col-span-4 mb-4 text-base font-normal text-primary_text_1 text-justify">
              {data.value}
            </span>
            :
            <>
              <span className="col-span-1 text-base font-normal text-primary_gray_2">
                {data.key}
              </span>
              <span className="col-span-2 text-base font-medium text-primary_text_1">
                {data.value}
              </span>
            </>
        }
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
    className={`flex items-center justify-between ${isActivatorActive
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

const CompetenciaIcon = ({ competencia }) => {
  switch (competencia) {
    case 'Pedagógica':
      return <MdSchool className="h-7 w-6 text-gray-700 mr-2" />;
    case 'Comunicativa':
      return <MdOutlineGroups className="h-7 w-6 text-gray-700 mr-2" />;
    case 'De Gestión':
      return <MdOutlineEngineering className="h-7 w-6 text-gray-700 mr-2" />;
    case 'Investigativa':
      return <MdContentPasteSearch className="h-7 w-6 text-gray-700 mr-2" />;
    case 'Tecnológica':
      return <MdComputer className="h-7 w-6 text-gray-700 mr-2" />;
    default:
      return <MdHelpOutline className="h-7 w-6 text-gray-700 mr-2" />;
  }
};

const getBackgroundColor = (momento) => {
  switch (momento) {
    case 'Explorador':
      return 'bg-[#00b4d8]'; // Color para Explorador (#00b4d8)
    case 'Integrador':
      return 'bg-[#0077b6]'; // Color para Integrador (#0077b6)
    case 'Innovador':
      return 'bg-[#03045e]'; // Color para Innovador (#03045e)
    default:
      return 'bg-gray-400'; // Color de fondo por defecto
  }
};

export const CompetenciaCard = ({ competencias = [], momento }) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {competencias.map((comp, idx) => (
          <div key={idx} className="flex items-center">
            <CompetenciaIcon competencia={comp.nombre} />
            <h2 className="text-md font-medium text-gray-900">Competencia {comp.nombre}</h2>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button className={`${getBackgroundColor(momento)} text-white text-sm px-3 py-1 rounded-full`}>
          Momento {momento}
        </button>
      </div>
    </div>
  );
};

export const TalleresPanel = ({ extra, taller }) => (
  <div className={`${extra}`}>
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-3 md:col-span-1 bg-primary_gray_1 rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200 justify-between">
        <TitleTaller value={taller.nombre} />
        <CompetenciaCard competencias={taller.competencias} momento={taller.momento} />
        <p className="text-justify mt-1 mb-2">{taller.descripcion}</p>
        <div className="col-span-2 border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
          <span className="text-sm font-normal text-primary_gray_2">
            Ponentes
          </span>
          {taller.ponentes.map((ponente, idx) => (
            <span key={idx} className="text-base font-medium text-primary_text_1">
              {ponente.nombre}
            </span>
          ))}
        </div>
        <CarouselComponent taller={taller} />

      </div>
    </div>
  </div>
);

export const SesionesPanel = ({ extra, sesion }) => (
  <div className={`${extra}`}>
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-3 md:col-span-1 bg-primary_gray_1 rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200 justify-between">
        <Info>
          <InfoPill
            value={sesion.fecha}
            size="medium"
            type="date"
            icon="date"
          />
        </Info>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
            <span className="text-sm font-normal text-primary_gray_2">
              Modalidad
            </span>
            <span className="text-base font-medium text-primary_text_1">
              {sesion.modalidad}
            </span>
          </div>
          <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
            <span className="text-sm font-normal text-primary_gray_2">
              {sesion.modalidad == 'Virtual' ? "Enlace" : "Ubicación"}
            </span>
            <span className="text-base font-medium text-primary_text_1">
              {sesion.modalidad == 'Virtual' ? <a href={sesion.ubicacion} style={{ color: '#002856', textDecoration: 'underline' }} target='_blank'>Enlace</a> : sesion.ubicacion}
            </span>
          </div>
          <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
            <span className="text-sm font-normal text-primary_gray_2">
              Hora de inicio
            </span>
            <span className="text-base font-medium text-primary_text_1">
              {sesion.hora_inicio}
            </span>
          </div>
          <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
            <span className="text-sm font-normal text-primary_gray_2">
              Duración
            </span>
            <span className="text-base font-medium text-primary_text_1">
              {sesion.duracion}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PonentesPanel = ({ extra, ponente }) => (
  <div className={`${extra}`}>
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-3 md:col-span-1 bg-primary_gray_1 rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200 justify-between">
        <span className="text-sm font-medium text-primary_gray_4">
          {ponente.titulo_charla}
        </span>
        <span className="text-base font-medium text-primary_text_1">
          {ponente.nombre}
        </span>
      </div>
    </div>
  </div>
);

export const PonentesPanelMicrotalleres = ({ extra, ponente }) => (
  <div className={`${extra}`}>
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-3 md:col-span-1 bg-primary_gray_1 rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200 justify-between">
        <span className="text-base font-medium text-primary_text_1">
          {ponente}
        </span>
      </div>
    </div>
  </div>
);

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "2px solid #D1D5DB" : "2px solid #E5E7EB",
    boxShadow: state.isFocused ? "0 0 0 1px #D1D5DB" : "none",
    "&:hover": {
      border: state.isFocused ? "2px solid #D1D5DB" : "2px solid #D1D5DB",
    },
    padding: "0.25rem 0.5rem",
    borderRadius: "0.65rem", // More rounded corners
    fontSize: '14px', // Smaller font size
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#FAFAFA" : state.isFocused ? "#F5F5F5" : "#FFFFFF",
    color: "#4B5563",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
    borderRadius: "0.5rem", // More rounded corners
    margin: "0.25rem 0",
    fontSize: '14px', // Smaller font size
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#D1D5DB",
    "&:hover": {
      color: "#D1D5DB",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF",
    fontSize: '14px', // Smaller font size
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.65rem", // More rounded corners
    overflow: "hidden",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#4B5563",
    fontSize: '14px', // Smaller font size
  }),
};




const EventoView = ({ extra, children }) => (
  <div className={`flex flex-col w-full bg-white rounded-lg  md:p-6 ${extra}`}>
    {children}
  </div>
);

export default EventoView;
