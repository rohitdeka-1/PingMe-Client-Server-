import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import Form from "../Components/Auth/Form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setloading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    else if (name === "fullname") {
      setFullname(value);
    }
    else if (name === "username") {
      setUsername(value);
    }
  }
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      setloading(true)
      const res = await axiosInstance.post("/auth/register",{email,password,fullname,username});
      if(res.data.success){
        toast.success(res.data.message);
        setTimeout(()=>{
          navigate("/home")
        },1200)
      }
      else {
        toast.error(res.data.message || "Registration failed.");
      }

    }catch(err){
      const errorMessage = err?.response?.data?.message
      toast.error(errorMessage)
      console.log("Error Registration: ",err)
    }finally{
      setloading(false)
    }
  }
  
  return (
    <div className=" text-white min-h-screen bg-[#161717] p-6 flex flex-col justify-center">
      <h1 className="flex justify-center tracking-[2px] font-geist font-bold text-3xl">
        PingMe
      </h1>
      <div>
        <Form btnLabel="Register" loading={loading} onClick={handleSubmit}>
          <input
            type="text"
            name="fullname"
            onChange={handleInputChange}
            placeholder="Name"
            value={fullname}
            className="bg-transparent p-3  w-full text-white rounded-xl outline-blue-400"
            required
            />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            className="bg-transparent p-3  w-full text-white rounded-xl outline-blue-400"
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Email"
            className="bg-transparent p-3 w-full text-white rounded-xl outline-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={handleInputChange}
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
