import React, { useState } from "react";
import Form from "../Components/Auth/Form";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const handleFormChange = (e) => {
    setEmail(e.target.value)
  }

  const handleResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true)
    const backendURI = `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/reset`;
    try {
      const response = await axios.post(`${backendURI}`,{email});
      if (response.data.success) {
        toast.success("Check your email for the password reset link.");
        setIsEmailSent(true);
      }
    } catch (err) {
      console.log("Error in handleResetEmail : ", err);
      toast.error("Failed to send reset email. Please try again.");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className=" text-white min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <h1 className="flex justify-center tracking-[2px] font-geist font-bold text-3xl">
        PingMe
      </h1>
      <div>
        <Form btnLabel="Send Reset Mail" loading={loading}  onClick={handleResetEmail}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleFormChange}
            placeholder="Email"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />
        </Form>
      </div>
      <div>
      {isEmailSent && (
        <div>
          <p className="text-green-600 p-3">
            Check Email for password reset Instruction
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Reset;
