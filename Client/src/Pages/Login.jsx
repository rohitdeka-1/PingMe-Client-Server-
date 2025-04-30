import React from "react";
import Form from "../Components/Auth/Form";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <div>
        <h1 className="font-bold font-calSans mb-4 text-3xl tracking-[2.5px] items-end flex justify-center text-white">
          PingMe
        </h1>
      </div>
      <Form btnLabel="Login">
        <input
          type="text"
          name="identity"
          placeholder="Email/Username"
          className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400 "
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
        <Link className="text-green-600" to="/register">
          Register
        </Link>{" "}
      </p>

      <p className="mt-2 text-slate-500 px-3 py-1">
        Forgot Password?{" "}
        <Link className="text-green-600" to="/reset">
          Reset
        </Link>{" "}
      </p>
    </div>
  );
};

export default Login;
