import React from "react";

const Form = ({ children, btnLabel }) => {
  return (
    <div className="p-2 mt-4 h-1/2">
      <form className="flex flex-col gap-2">
       {children}
       <button
        type="submit"
        className="bg-green-600 mt-2 text-white font-geist font-bold p-3 rounded-2xl"
      >
        {btnLabel}
      </button>
      </form>
    </div>
  );
};

export default Form;
