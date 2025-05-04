import React from "react";
import "./Skeleton.css";

const Skeleton = () => {
  return (
<div className="rhd-loader">
    <div className="orbit">
        <div className="dot r-dot"></div>
        <div className="dot h-dot"></div>
        <div className="dot d-dot"></div>
    </div>
</div>
  );
};

export default Skeleton;
