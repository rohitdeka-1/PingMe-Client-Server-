import React, { useEffect, useState } from "react";
import Form from "../Components/Auth/Form";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPass = () => {
  const { token } = useParams();
  console.log(token) // yaad dila dena
  const [validToken, setValidToken] = useState(null);
  const backendURI = import.meta.env.VITE_BACKEND_URI;
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(
          `${backendURI}/resetpassword/${token}`
        );
        if (response.data.success) {
          setValidToken(response.data.success);
        }
      } catch (err) {
        setValidToken(false);
        toast.error("Invalid or expired reset link.");
      }
    };
    validateToken();
  }, [token]);

  if (validToken === null) return <p className="text-white bg-[#161717] min-h-screen flex justify-center items-center text-center">Validating link...</p>;

  if (validToken === false) {
    return <p className="text-red-600 bg-[#161717] flex justify-center items-center min-h-screen text-center">Invalid or expired token.</p>;
  }

  return (
    <div className=" text-white min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <h1 className="flex justify-center tracking-[2px] font-geist font-bold text-3xl">
        PingMe
      </h1>
      <div>
        <Form btnLabel="Reset Password">
          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Confirm Password"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />
        </Form>
      </div>
      <div>
        <p className="text-green-600 p-3">
          Do remember the password this time :)
        </p>
      </div>
    </div>
  );
};

export default ResetPass;
