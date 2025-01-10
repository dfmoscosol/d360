import React, { useState, useEffect, useRef } from 'react';
import { Info,SubTitle } from "../../pages/Eventos/ui/components/EventoView/EventoView";
import { InfoPill } from "@components";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CarouselComponent = ({ taller }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [height, setHeight] = useState('auto');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.clientHeight);
    }
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % taller.sesiones.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + taller.sesiones.length) % taller.sesiones.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      
      <div className="overflow-hidden relative" style={{ height }}>
        {taller.sesiones.map((sesion, index) => (
          <div
            key={index}
            className={`absolute w-full transition-transform duration-500 ${
              index === currentIndex ? 'transform translate-x-0' : 'transform translate-x-full'
            }`}
            ref={index === currentIndex ? contentRef : null}
          >
            <div className="p-4">
              <Info>
                <InfoPill value={sesion.fecha} size="medium" type="date" icon="date" />
              </Info>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
                  <span className="text-sm font-normal text-primary_gray_2">Modalidad</span>
                  <span className="text-base font-medium text-primary_text_1">{sesion.modalidad}</span>
                </div>
                <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
                  <span className="text-sm font-normal text-primary_gray_2">{sesion.modalidad == 'Virtual' ? "Enlace" : "Ubicación"}</span>
                  <span className="text-base font-medium text-primary_text_1">{sesion.modalidad == 'Virtual' ? <a href={sesion.ubicacion} style={{ color: '#002856', textDecoration: 'underline' }} target='_blank'>Enlace</a> : sesion.ubicacion}</span>
                </div>
                <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
                  <span className="text-sm font-normal text-primary_gray_2">Hora de inicio</span>
                  <span className="text-base font-medium text-primary_text_1">{sesion.hora_inicio}</span>
                </div>
                <div className="border border-primary_gray_5 rounded-lg py-2 px-4 flex flex-col gap-0">
                  <span className="text-sm font-normal text-primary_gray_2">Duración</span>
                  <span className="text-base font-medium text-primary_text_1">{sesion.duracion}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center ">
        <button
          onClick={prevSlide} style={{background:'#c8c8c9'}}
          className="bg-opacity-50 text-white p-2 rounded-full mx-2"
        >
          <FaArrowLeft />
        </button>
{/*         <SubTitle value={"Sesiones"} />
 */}        <button
          onClick={nextSlide} style={{background:'#c8c8c9'}}
          className="bg-opacity-50 text-white p-2 rounded-full mx-2"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CarouselComponent;
