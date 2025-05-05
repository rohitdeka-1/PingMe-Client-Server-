import React,{useState} from "react";
import Form from "../Components/Auth/Form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const Login = () => {

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("")

  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "identity") {
      setIdentity(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      const res = await axiosInstance.post("/auth/login",{identity,password});
      if(res.data.success){
        localStorage.setItem("ACCESS_TOKEN", res.data.token); 
        toast.success("Access Granted")
        setTimeout(()=>{
          navigate("/home")
        },1000)
      }
      else {
        toast.error(res.data.message || "Login failed.");
      }
    }
    catch(err){
      const errorMessage = err?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Error Login: ",err)
    }

  }

  return (
    <div className="min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <div>
        <h1 className="font-bold font-calSans mb-4 text-3xl tracking-[2.5px] items-end flex justify-center text-white">
          PingMe
        </h1>
      </div>
      <Form btnLabel="Login" onClick={handleSubmit}>
        <input
          type="text"
          name="identity"
          value={identity}
          onChange={handleInputChange}
          placeholder="Email/Username"
          className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400 "
          required
          />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleInputChange}
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
