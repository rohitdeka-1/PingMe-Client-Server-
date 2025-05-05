import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../Chat/Avatar";

const Heading = () => {
  return (
    <div className="flex justify-between">
      <div className=" font-calSans font-bold text-white text-[28px] tracking-[2px]">
        PingMe
      </div>
      <button>
        <Link to={"/profile"}>
        <Avatar  />
        </Link>
      </button>
    </div>
  );
};

export default Heading;
