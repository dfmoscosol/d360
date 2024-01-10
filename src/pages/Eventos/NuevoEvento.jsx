import React from "react";

import { Link } from "react-router-dom";

import { GrWorkshop } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamIdea } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";

const NuevoEvento = () => {
  const dropdownItems = [
    {
      to: "jornadaInnovacion",
      label: "Jornada de Innovación",
      icon: <GiTeamIdea size={30} />,
    },
    {
      to: "charla",
      label: "Charla",
      icon: <GrWorkshop size={30} />,
    },
    {
      to: "taller",
      label: "Taller",
      icon: <FaChalkboardTeacher size={30} />,
    },
    {
      to: "observacionAulica",
      label: "Observación Áulica",
      icon: <SiGoogleclassroom size={30} />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dropdownItems.map((item, index) => (
          <Link to={item.to} key={index} className=" ">
            <div className="text-primary_gray_4 hover:bg-primary_gray_1 hover:text-black px-2 py-4 rounded-lg border border-primary_gray_5 col-span-1 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-300">
              <div className={`$ bg-gray-100 text-primary_text_1 p-2 rounded-lg`}>{item.icon}</div>
              <span className="text-base font-medium text-primary_gray_4">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default NuevoEvento;
