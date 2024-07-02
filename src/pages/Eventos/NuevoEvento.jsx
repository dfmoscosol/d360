import React from "react";

import { Link } from "react-router-dom";

import { GrWorkshop } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeamIdea } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { motion } from "framer-motion";

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
      to: "microtaller",
      label: "Microtaller",
      icon: <FaChalkboardTeacher size={30} />,
    },
    {
      to: "observacionAulica",
      label: "Observación Áulica",
      icon: <SiGoogleclassroom size={30} />,
    },
  ];

  const container = {
    hidden: { opacity: 1, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {dropdownItems.map((itemList, index) => (
          <motion.div key={index} className="item" variants={item}>
            <Link to={itemList.to} key={index} className=" ">
              <div className="text-primary_gray_4 hover:bg-primary_gray_1 hover:text-black px-2 py-4 rounded-lg border border-primary_gray_5 col-span-1 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-300">
                <div
                  className={`$ bg-gray-100 text-primary_gray_4 p-2 rounded-lg`}
                >
                  {itemList.icon}
                </div>
                <span className="text-base font-medium text-primary_gray_4">
                  {itemList.label}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default NuevoEvento;
