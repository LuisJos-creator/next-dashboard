"use client";

import React, { useEffect, useState } from "react";
import Radial from "./radial";
import Progress from "./progress";
import Stats from "./stats";
import { supabase } from "../utils/supabaseClient";

const contdash = () => {
  const [products, setProducts] = useState([]);
  const [registroCount, setRegistroCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);

      const [productResponse, registroResponse] = await Promise.all([
        supabase.from("productos").select("id, nombre, descripcion, cantidad, precio"),
        supabase.from("registro").select("id, condicion"),
      ]);

      const productError = productResponse.error;
      const registroError = registroResponse.error;
      const productData = productResponse.data || [];
      const registroData = registroResponse.data || [];

      if (productError || registroError) {
        const message = [productError?.message, registroError?.message].filter(Boolean).join(" | ");
        console.error("Error fetching dashboard metrics:", message);
        setError(message || "Error al obtener datos de Supabase");
        setProducts([]);
        setRegistroCount(0);
        setSalesCount(0);
        setLoading(false);
        return;
      }

      const sales = registroData.filter((item) => String(item.condicion).toLowerCase().includes("venta")).length;

      setProducts(productData);
      setRegistroCount(registroData.length);
      setSalesCount(sales);
      setError(null);
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
  const totalValue = products.reduce((sum, item) => sum + ((Number(item.cantidad) || 0) * (Number(item.precio) || 0)), 0);
  const inStockCount = products.filter((item) => Number(item.cantidad) > 0).length;
  const inStockPercent = totalProducts ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockThreshold = 5;
  const lowStockCount = products.filter((item) => Number(item.cantidad) > 0 && Number(item.cantidad) <= lowStockThreshold).length;
  const lowStockPercent = totalProducts ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const salesPercent = registroCount ? Math.round((salesCount / registroCount) * 100) : 0;

  return (
    <div className="grid gap-6 px-4 py-4 lg:grid-cols-3 lg:px-0">
      <article className="panel-card p-6">
        <div className="mb-4 text-sm uppercase tracking-[0.25em] text-cyan-700 font-semibold">Stock</div>
        <Radial value={inStockPercent} label={`${inStockPercent}% productos con stock`} />
      </article>

      <article className="panel-card p-6">
        <div className="mb-4 text-sm uppercase tracking-[0.25em] text-rose-600 font-semibold">Alerta de stock</div>
        <Progress
          value={lowStockPercent}
          max={100}
          label={`Productos con poco stock: ${lowStockCount}/${totalProducts} (≤ ${lowStockThreshold})`}
        />
      </article>

      <article className="panel-card p-6">
        <div className="mb-4 text-sm uppercase tracking-[0.25em] text-amber-600 font-semibold">Ventas</div>
        <Radial value={salesPercent} label={`${salesPercent}% ventas registradas`} />
      </article>

      <section className="panel-card p-6 lg:col-span-3">
        <div className="grid gap-6 lg:grid-cols-1 items-start">
          <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Resumen del inventario</h2>
                <p className="text-sm text-slate-700">Métricas clave recolectadas desde Supabase.</p>
              </div>
              <div className="rounded-full bg-base-200 px-4 py-2 text-sm font-medium text-slate-800">
                Total productos: {totalProducts}
              </div>
            </div>
            <Stats
              items={[
                { title: "Unidades en stock", value: totalStock, desc: "Cantidad disponible" },
                { title: "Valor inventario", value: `$${totalValue.toLocaleString()}`, desc: "Precio total" },
                { title: "Registros de venta", value: registroCount, desc: "Eventos guardados" },
              ]}
            />
          </div>

          <div className="rounded-3xl border border-base-200/70 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-700">Acciones rápidas</p>
              <h3 className="text-lg font-semibold text-slate-900">Gestión de inventario</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <a href="/inventario" className="btn btn-outline btn-sm w-full justify-center gap-2 hover:bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/>
                </svg>
                Gestionar productos
              </a>
              <a href="/registro" className="btn btn-outline btn-sm w-full justify-center gap-2 hover:bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d="M348.5-291.5Q360-303 360-320t-11.5-28.5Q337-360 320-360t-28.5 11.5Q280-337 280-320t11.5 28.5Q303-280 320-280t28.5-11.5Zm0-160Q360-463 360-480t-11.5-28.5Q337-520 320-520t-28.5 11.5Q280-497 280-480t11.5 28.5Q303-440 320-440t28.5-11.5Zm0-160Q360-623 360-640t-11.5-28.5Q337-680 320-680t-28.5 11.5Q280-657 280-640t11.5 28.5Q303-600 320-600t28.5-11.5ZM440-280h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                </svg>
                Ver registros
              </a>
              <a href="/inventario?openModal=add" className="btn btn-outline btn-sm w-full justify-center gap-2 hover:bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
                Añadir producto
              </a>
            </div>
            <div className="mt-6 rounded-2xl bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Consejo del día</p>
              <p className="mt-2 text-sm text-slate-700">Mantén tu inventario actualizado para evitar pérdidas por falta de stock.</p>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Registros</p>
                <p className="mt-2 text-lg font-semibold text-amber-600">{salesCount} registros</p>
                <p className="text-sm text-slate-600">{salesPercent}% del total de registros</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stock disponible</p>
                <p className="mt-2 text-lg font-semibold text-cyan-700">{inStockPercent}% en stock</p>
                <p className="text-sm text-slate-600">{inStockCount} de {totalProducts} productos disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel-card p-6 lg:col-span-3">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Inventario de productos</h2>
            <p className="text-sm text-slate-700">Revisa los detalles de cada producto y su stock actual.</p>
          </div>
          <div className="text-sm text-slate-700">Datos conectados a la tabla <strong>productos</strong></div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-slate-700">
            <span className="loading loading-spinner loading-sm"></span>
            Cargando datos...
          </div>
        ) : error ? (
          <div className="text-error">Error: {error}</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300/50 bg-base-200/80 p-6 text-center text-slate-700">
            No se encontraron productos en Supabase.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default contdash;
