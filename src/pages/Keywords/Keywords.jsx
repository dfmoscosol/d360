import React, { useState } from "react";

import { Loader, FetchError } from "@components";

import { useGetAllKeywordsQuery } from "@redux/services/keyword/keywordApi";
import KeywordCard from "./components/KeywordCard/KeywordCard";
import KeywordComboBox from "./components/ComboBox/KeywordComboBox";
import { ContainerPage } from "@components";

const Keywords = () => {
  /**
   * Para el ComboBox
   */
  const listCompetencias = [
    "Investigativa",
    "De Gestión",
    "Tecnológica",
    "Comunicativa",
    "Pedagógica",
  ];

  const dictCompetencias = {
    Investigativa: "investigativa",
    "De Gestión": "gestion",
    Tecnológica: "tecnologica",
    Comunicativa: "comunicativa",
    Pedagógica: "pedagogica",
  };

  // Estado para almacenar el valor seleccionado
  const [selectedModalidad, setSelectedModalidad] = useState(
    listCompetencias[0]
  );

  const handleSelect = (value) => {
    setSelectedModalidad(value);
  };

  const { data, refetch, error, isLoading, isFetching, isError } =
    useGetAllKeywordsQuery({ value: dictCompetencias[selectedModalidad] });

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  let keywords = data.respuesta.terminos;

  const handleRefetch = () => {
    //console.log("refetching handleRefetch");
    refetch();
  };

  return (
    <ContainerPage>
      <div className="w-full md:max-w-xl rounded-lg flex flex-col gap-8">
        <div className="w-full bg-white flex flex-col rounded-lg p-4 ">
          <span className="font-medium text-base text-primary_color_1">
            Competencia
          </span>
          <div className="w-full mt-2">
            <KeywordComboBox
              items={listCompetencias}
              onSelect={handleSelect}
              hasBeenSelected={true}
              selected={selectedModalidad}
            />
          </div>
        </div>
        <div className="w-full bg-white flex flex-col rounded-lg p-4">
          <span className="font-medium text-base text-primary_color_1">
            Términos Clave
          </span>
          <KeywordCard
            oldKeywords={keywords}
            competencia={dictCompetencias[selectedModalidad]}
            handleRefetch={handleRefetch}
          />
        </div>
      </div>
    </ContainerPage>
  );
};

export default Keywords;
