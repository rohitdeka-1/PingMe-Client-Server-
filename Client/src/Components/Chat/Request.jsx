import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance";
import {io} from "socket.io-client";

const socket = io("http://localhost:8800");
const Request = () => {

  const [requestNumber, setrequestNumber] = useState(0)

  useEffect(()=>{
    const handleRequestNumber = async() => {
      try{
        const res = await axiosInstance.get("/user/requests");
        const requests = res.data.requests.length;
        setrequestNumber(requests);

        const userId = res.data.userId;  
        socket.emit("joinRoom", userId);
      }
      catch(err){
        console.error(err);
      }
    }
    handleRequestNumber();

    socket.on("requestUpdated", (data) => {
      setrequestNumber(data.requestCount);
    });
 
    return () => {
      socket.off("requestUpdated");
    };


  },[])

  return (
    <Link to="/requests">
    <div className="mt-5 mb-5 py-3 px-1 flex flex-col w-full text-white bg-[#2E2F2F] rounded-xl">
      <div className="flex items-center justify-between px-3">
        <p className="text-lg">Requests</p>
        <p className="text-lg text-whitefont-bold rounded-3xl bg-green-600 px-2 ">{requestNumber}</p>
      </div>
    </div>
    </Link>
    
  );
};

export default Request;
