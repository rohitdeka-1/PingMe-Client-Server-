import React from "react";

const Form = ({ children, btnLabel, onClick, loading }) => {
  return (
    <div className="p-2 mt-4 h-1/2">
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        <button
          type="submit"
          className={`mt-2 text-white font-geist font-bold p-3 rounded-2xl transition duration-300 flex items-center justify-center ${
            loading ? "bg-green-500 opacity-70 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}       >
           {loading ? <div className="basic-circle"></div> : btnLabel}
        </button>
      </form>
    </div>
  );
};

export default Form;
