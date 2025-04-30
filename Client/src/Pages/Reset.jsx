import React from "react";
import Form from "../Components/Auth/Form";
import { Link } from "react-router-dom";

const Reset = () => {
  return (
    <div className=" text-white min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <h1 className="flex justify-center tracking-[2px] font-geist font-bold text-3xl">
        PingMe
      </h1>
      <div>
        <Form btnLabel="Send Reset Mail">
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />
         
        </Form>
      
      </div>
      <div>
      <p className="text-green-600 p-3">
        Check Email for password reset Instruction
       </p>
      </div>
       
    </div>
  );
};

export default Reset;
