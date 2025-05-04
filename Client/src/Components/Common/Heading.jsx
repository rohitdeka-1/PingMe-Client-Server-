import React from "react";
import { Link } from "react-router-dom";

const Heading = () => {
  return (
    <div className="flex justify-between">
      <div className=" font-calSans font-bold text-white text-[28px] tracking-[2px]">
        PingMe
      </div>
      <button>
        <Link to={"/profile"}>
        <img
          src="./src/assets/react.svg"
          className="border border-slate-600 bg-slate-700 p-1 rounded-full"
          style={{ objectFit: "contain" }}
        />
        </Link>
      </button>
    </div>
  );
};

export default Heading;
