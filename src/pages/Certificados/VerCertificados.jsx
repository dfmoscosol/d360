import React from "react";

import { ContainerPage } from "@components";
import CertificadoCard from "./Components/CertificadoCard";

const VerCertificados = ({ certificados, handleRefetch }) => {
  console.log("certificados");
  console.log(certificados);

  return (
    <ContainerPage>
      <div className="w-full flex flex-col gap-4">
        {certificados.map((certificado, index) => (
          <CertificadoCard
            key={index}
            nombreCurso={certificado.nombre_curso}
            nombres={certificado.nombres}
            correo={certificado.correo}
            urlImagen={certificado.url_imagen}
            urlCurso={certificado.url_curso}
            fechaCreacion={certificado.fecha_creacion}
            urlLogo={certificado.url_logo}
            idCertificado={certificado.id_certificado}
            isApproved={certificado.isapproved}
            handleRefetch={handleRefetch}
          />
        ))}
      </div>
    </ContainerPage>
  );
};

export default VerCertificados;
