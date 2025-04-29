import React from "react";
import {Link} from "react-router-dom"
const Request = () => {

  return (
    <Link to="/requests">
    <div className="mt-5 mb-5 py-3 px-1 flex flex-col w-full text-white bg-[#2E2F2F] rounded-xl">
      <div className="flex items-center justify-between px-3">
        <p className="text-lg">Requests</p>
        <p className="text-lg text-whitefont-bold rounded-3xl bg-green-600 px-2 "> 2 </p>
      </div>
    </div>
    </Link>
    
  );
};

export default Request;
