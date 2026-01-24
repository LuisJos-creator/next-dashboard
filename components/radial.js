import React from "react";

const radial = () => {
  return (
    <>
      <div
        className="radial-progress"
        style={
          {
            "--value": "70",
            "--size": "12rem",
            "--thickness": "1rem",
          } /* as React.CSSProperties */
        }
        aria-valuenow={70}
        role="progressbar"
      >
        70%
      </div>
    </>
  );
};

export default radial;
