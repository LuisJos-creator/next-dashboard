import React from "react";
import Radial from "./radial";

const contdash = () => {
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <div className="row-span-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial />
            <h1 className="mt-2">Valor</h1>
          </div>
        </div>
        <div className="row-span-2 col-start-2 row-start-2">2</div>
        <div className="row-span-2 col-start-3 row-start-1">
          <div className="flex flex-col items-center justify-center h-full">
            <Radial />
            <h1 className="mt-2">Valor</h1>
          </div>
        </div>
        <div className="row-span-2 col-start-4 row-start-2">4</div>
        <div className="row-span-2 col-start-3 row-start-3">5</div>
        <div className="row-span-2 col-start-1 row-start-3">6</div>
      </div>
    </>
  );
};

export default contdash;
