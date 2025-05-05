import React from "react";
import { Link } from "react-router-dom";
  

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#161717] p-6 text-white flex flex-col justify-center items-center gap-2">
      <div>
        <img className="h-48 w-48" src="https://res.cloudinary.com/doejdsmym/image/upload/v1746470389/pingme_o3pgfb.png" />
      </div>
      <div className="flex flex-col gap-3 w-full items-center">
      <Link to={`/login`}><div className="p-2 text-xl font-bold active:bg-green-700 rounded-2xl w-44 flex justify-center items-center bg-green-600">
       <button> Login </button>
        </div>
        </Link>
        <Link to={`/register`}><div className="p-2 text-xl font-bold active:bg-green-700 rounded-2xl w-44 flex justify-center items-center bg-green-600">
       <button> Register </button>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
