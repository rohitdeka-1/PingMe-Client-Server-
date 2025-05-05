import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#161717] p-6 text-white flex flex-col justify-center items-center gap-2">
      <div>
        <img className="h-48 w-48" src="/pingme.png" />
      </div>
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="p-2 text-xl font-bold active:bg-green-700 rounded-2xl w-44 flex justify-center items-center bg-green-600">
          <button> <Link to={`/login`}>Login</Link> </button>
        </div>
        <div className="p-2 text-xl font-bold  active:bg-green-700 rounded-2xl w-44 flex justify-center items-center bg-green-600">
          <button> <Link to={`/register`}>  Register</Link></button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
