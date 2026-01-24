import React from "react";
import Radial from "./radial";
import Progress from "./progress";
import Stats from "./stats";

const contdash = () => {
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial />
            <h1 className="mt-2">Valor</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-1 col-start-2 row-start-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Progress />
            <h1 className="mt-2">Valor</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2 col-start-3 row-start-1">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial />
            <h1 className="mt-2">Valor</h1>
          </div>
        </div>
        <div className="bg-base-200 rounded-box p-3 m-3 row-span-2 col-start-4 row-start-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Stats />
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
            <h1 className="mt-2">Valor</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default contdash;
