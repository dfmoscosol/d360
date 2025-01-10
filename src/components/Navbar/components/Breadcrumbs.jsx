import React from "react";
import { useLocation, Link } from "react-router-dom";
import { PathNamesTranslations } from "@routes/pathConstants";

const Breadcrumbs = () => {
  const location = useLocation();

  let pathnames = location.pathname.split("/").filter((x) => x);

  // Obtener el último elemento del array
  const ultimoElemento = pathnames[pathnames.length - 1];
  console.log(ultimoElemento)

  // Verificar si el último elemento está presente como clave en el diccionario
  if (!(ultimoElemento in PathNamesTranslations)) {
    pathnames = pathnames.slice(0, -1);
    //El último elemento "${ultimoElemento}" no está presente en el diccionario.
  }

  return (
    <div className="flex leading-none gap-2 tracking-tight">
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return last ? (
          <span
            key={to}
            className="text-lg md:text-2xl font-medium text-primary_text_1 "
            aria-current="page"
          >
            {PathNamesTranslations[value]}
          </span>
        ) : (
          <Link
            to={to}
            key={to}
            className="text-primary_gray_4 flex items-center gap-2"
          >
            <span key={to} className="text-lg md:text-2xl font-light">
              {PathNamesTranslations[value]}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
