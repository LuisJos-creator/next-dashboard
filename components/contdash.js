import React from "react";
import Radial from "./radial";
import Progress from "./progress";
import Stats from "./stats";
import { supabase } from "../utils/supabaseClient";

//*tengo que completar esto para que muestre info del supabase, lo dejo asi para continuar con otras cosas, creo que dejare esto de ultimo, me pondre a hacer  la parte de la facturacion

const contdash = () => {
  
const fetchData = async () => {
  const { data, error } = await supabase
    .from("inventario")
    .select("*");
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data fetched successfully:", data);
  }
};

fetchData();

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial />
            <h1 className="mt-2">Porcentaje de stock</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-1 col-start-2 row-start-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Progress />
            <h1 className="mt-2">Productos en stock</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2 col-start-3 row-start-1">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial />
            <h1 className="mt-2">Porcentaje de ventas</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2 col-start-4 row-start-1">
          <div className="flex flex-col items-center justify-center h-full">
            <Stats />
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-1 col-start-2 row-start-1">
          <div className="flex flex-col items-center justify-center h-full">
            <Progress />
            <h1 className="mt-2">Objetivo de ventas</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default contdash;
