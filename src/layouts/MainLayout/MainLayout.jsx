import React from "react";

import { Outlet } from "react-router-dom";

import { Sidebar, PageWrapper } from "@components";

const MainLayout = () => {
  return (
    <div className="">
      <Sidebar />
      <main>
        {/** Outlet es donde se renderizarán las rutas hijas. */}
        <PageWrapper>
          {/* Envuelve el Outlet con PageWrapper */}
          <Outlet />
        </PageWrapper>
      </main>
    </div>
  );
};

export default MainLayout;
