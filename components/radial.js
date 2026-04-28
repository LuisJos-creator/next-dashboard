import React from "react";

const radial = ({ value = 70, label = "" }) => {
  const numericValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="text-center">
      <div
        className="radial-progress"
        style={{
          "--value": numericValue,
          "--size": "12rem",
          "--thickness": "1rem",
        }}
        aria-valuenow={numericValue}
        role="progressbar"
      >
        {numericValue}%
      </div>
      {label && <div className="mt-2 text-sm text-slate-700">{label}</div>}
    </div>
  );
};

export default radial;
