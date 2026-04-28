import React from "react";
import Contdash from "./contdash";

const Dashboard = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-base-200/70 bg-base-100/95 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="space-y-3 text-center lg:text-left">
            <p className="section-title text-xs text-cyan-700 font-semibold">Visión general</p>
            <h1 className="text-3xl font-semibold text-slate-950">Dashboard de inventario</h1>
            <p className="max-w-3xl text-slate-700 leading-7">
              Explora las métricas clave, monitorea el stock y revisa los registros de ventas con visuales sencillos y claros.
            </p>
          </div>
        </section>

        <Contdash />
      </div>
    </main>
  );
};

export default Dashboard;
