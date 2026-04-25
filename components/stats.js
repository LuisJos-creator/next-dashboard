import React from "react";

const stats = ({ items = [] }) => {
  return (
    <div className="stats stats-vertical shadow">
      {items.map((item, index) => (
        <div className="stat" key={index}>
          <div className="stat-title">{item.title}</div>
          <div className="stat-value">{item.value}</div>
          {item.desc && <div className="stat-desc">{item.desc}</div>}
        </div>
      ))}
    </div>
  );
};

export default stats;
