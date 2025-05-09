import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { socket } from "../../utils/socket";

const Request = () => {
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const fetchRequestNumber = async () => {
      try {
        // Fetch the initial number of pending requests
        const res = await axiosInstance.get("/user/requests");
        const requests = res.data.requests.length;
        setRequestNumber(requests);

        // Join the user's room for real-time updates
        const userId = res.data.userId;
        socket.emit("joinRoom", userId);
      } catch (err) {
        console.error("Error fetching request number:", err);
      }
    };

    fetchRequestNumber();

    // Listen for real-time updates
    socket.on("requestUpdated", (data) => {
      setRequestNumber(data.requestCount);
    });

    return () => {
      socket.off("requestUpdated");
    };
  }, []);

  return (
    <Link to="/requests">
      <div className="mt-5 mb-5 py-3 px-1 flex flex-col w-full text-white bg-[#2E2F2F] rounded-xl">
        <div className="flex items-center justify-between px-3">
          <p className="text-lg">Requests</p>
          <p
            className={`text-lg font-bold rounded-3xl ${
              requestNumber === 0 ? `bg-gray-700` : `bg-green-600`
            } px-2`}
          >
            {requestNumber}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Request;