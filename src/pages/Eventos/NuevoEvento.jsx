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
      icon: <GiTeamIdea size={25} />,
      colors: "bg-amber-100 text-amber-600",
    },
    {
      to: "charla",
      label: "Charla",
      icon: <GrWorkshop size={25} />,
      colors: "bg-blue-100 text-blue-600",
    },
    {
      to: "taller",
      label: "Taller",
      icon: <FaChalkboardTeacher size={25} />,
      colors: "bg-rose-100 text-rose-600",
    },
    {
      to: "observacionAulica",
      label: "Observación Áulica",
      icon: <SiGoogleclassroom size={25} />,
      colors: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {dropdownItems.map((item, index) => (
          <Link
            to={item.to}
            key={index}
            className=" "
          >
            <div className="text-primary_gray_2 hover:bg-primary_gray_1 hover:text-black px-2 py-4 rounded-lg border-2 border-dashed border-primary_gray_5 col-span-1 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200">
              <div className={`${item.colors} p-2 rounded-lg`}>{item.icon}</div>
              <span className="text-base font-medium text-primary_gray_3">
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
