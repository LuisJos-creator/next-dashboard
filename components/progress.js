import React from 'react'

const progress = ({ value = 0, max = 100, label = "" }) => {
  const numericValue = Math.min(max, Math.max(0, Number(value) || 0));
  const percent = max ? Math.round((numericValue / Number(max)) * 100) : 0;

  return (
    <div className="w-full">
      {label && <div className="mb-2 text-sm">{label}</div>}
      <progress className="progress w-full" value={numericValue} max={max}></progress>
      <div className="mt-1 text-xs text-right">
        {numericValue} / {max} ({percent}%)
      </div>
    </div>
  );
};

export default progress
