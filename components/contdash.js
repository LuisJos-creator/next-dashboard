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
    <>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial value={inStockPercent} label={`${inStockPercent}% productos con stock`} />
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-1 col-start-2 row-start-2">
          <div className="flex flex-col justify-center h-full w-full">
            <Progress
              value={lowStockPercent}
              max={100}
              label={`Productos con poco stock: ${lowStockCount}/${totalProducts} (≤ ${lowStockThreshold})`}
            />
            <h1 className="mt-2">Productos con poco stock</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2 col-start-3 row-start-1">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial value={salesPercent} label={`${salesPercent}% ventas registradas`} />
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2 col-start-4 row-start-1">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <Stats
              items={[
                { title: "Total productos", value: totalProducts, desc: "Productos distintos" },
                { title: "Unidades en stock", value: totalStock, desc: "Cantidad disponible" },
                { title: "Valor inventario", value: `$${totalValue.toLocaleString()}`, desc: "Precio total" },
              ]}
            />
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-1 col-start-2 row-start-1">
          <div className="flex flex-col justify-center h-full w-full">
            <Progress value={salesPercent} max={100} label={`Objetivo de ventas: ${salesCount} registros`} />
          </div>
        </div>

              <div className="bg-base-200 rounded-box p-3 m-3 row-span-1 col-start-1 row-start-3 col-end-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Inventario de Supabase</h2>
              <p className="text-sm text-base-content/70">Datos cargados desde la tabla <strong>productos</strong>.</p>
            </div>
            <div className="text-right text-sm">
              <span>Total productos: {totalProducts}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              <span>Cargando datos...</span>
            </div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : products.length === 0 ? (
            <div>No se encontraron productos en Supabase.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
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
        </div>
      </div>
      </div>


    </>
  );
};

export default contdash;
