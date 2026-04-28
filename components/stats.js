import React from "react";

const stats = ({ items = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-3xl border border-base-200/70 bg-white p-6 shadow-sm">
          <div className="text-sm uppercase tracking-[0.18em] text-slate-500">{item.title}</div>
          <div className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</div>
          {item.desc && <div className="mt-2 text-sm text-slate-600">{item.desc}</div>}
        </div>
      ))}
    </div>
  );
};

export default stats;
