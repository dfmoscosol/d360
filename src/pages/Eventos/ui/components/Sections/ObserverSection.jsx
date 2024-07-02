import React from "react";
import ContainerForm from "../ContainerForm/ContainerForm";
import FormLabel from "../FormLabel/FormLabel";
import { useForm } from "react-hook-form";
import { Button,DataTable } from "@components";
import { Loader, FetchError } from "@components";
import { useGetAllObservadoresQuery } from "@redux/services/evento/eventoApi";

import EventoView, {
  Header,
  SectionContainer,
} from "../EventoView/EventoView";

import ObservadoresTab from "../ObservadoresTab/ObservadoresTab";

const ObserverSection = ({ idEvento, handleRefetch, idTaller, docentesInscritos }) => {

  return (
    <EventoView>
      <Header
        color="bg-primary_gray_1 text-primary_gray_4"
        title="Observadores"
        subTitle="Agregar observadores"
        hasIcon={false}
      />
        <ObservadoresTab></ObservadoresTab>
     
    </EventoView>
  );
};

export default ObserverSection;
