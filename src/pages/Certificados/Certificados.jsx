import React from "react";

import { Loader, FetchError } from "@components";
import { useGetAllCertificadosQuery } from "@redux/services/certificado/certificadoApi";
import VerCertificados from "./VerCertificados";

const Certificados = () => {
  const { data, refetch, error, isLoading, isFetching, isError } =
    useGetAllCertificadosQuery();

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const certificados = data.respuesta.certificados;
  console.log(certificados);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <div>
      <VerCertificados
        certificados={certificados}
        handleRefetch={handleRefetch}
      />
    </div>
  );
};

export default Certificados;
