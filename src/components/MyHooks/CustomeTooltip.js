import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className=""
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          color: "#F13A01",
          borderRadius: "9px",
        }}
      >
        <p className="label">{`Month: ${label}`}</p>
        <p className="intro">{`Users: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
