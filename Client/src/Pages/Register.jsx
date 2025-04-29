import React from "react";
import Form from "../Components/Auth/Form";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className=" text-white min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <h1 className="flex justify-center tracking-[2px] font-geist font-bold text-3xl">
        PingMe
      </h1>
      <div>
        <Form btnLabel="Register">
          <input
            type="text"
            name="fullname"
            placeholder="Name"
            className="bg-transparent p-3  w-full text-white rounded-xl outline-blue-400"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="bg-transparent p-3  w-full text-white rounded-xl outline-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />
        </Form>
        <p className="mt-2 text-slate-500 px-3 py-1">
          Don't have an account?{" "}
          <Link className="text-green-600" to="/login">
            Login
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
