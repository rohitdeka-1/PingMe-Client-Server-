import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import NoUser from "../../assets/nouser.png";
import Skeleton from "../loader/Loading";
import {socket} from "../../utils/socket.js"; 

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await axiosInstance.get("/user/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(response.data.requests || []);
        const userId = response.data.userId;  
        socket.emit("joinRoom", userId);
      } catch (err) {
        console.error(
          "Error fetching requests:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    // Listen for real-time updates
    socket.on("requestUpdated", (data) => {
      console.log("Real-time update received:", data.requests);
      setRequests(data.requests || []);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("requestUpdated");
    };
  }, [navigate]);

  const handleAccept = async (request) => {
    const requestId = request._id;
    const fromUserId = request.from._id;

    if (!fromUserId) {
      console.error("From User ID is undefined");
      return;
    }

    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await axiosInstance.post(
        `/user/requests/accept/${fromUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Request accepted successfully");
        // Update request status to accepted
        setRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status: "accepted" } : req
          )
        );
      } else {
        console.log("Failed to accept request:", response.data.message);
      }
    } catch (err) {
      console.error(
        "Error accepting request:",
        err.response?.data || err.message
      );
    }
  };

  const handleReject = async (request) => {
    const requestId = request._id;
    const fromUserId = request.from._id;

    if (!fromUserId) {
      console.error("From User ID is undefined");
      return;
    }

    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await axiosInstance.post(
        `/user/requests/reject/${fromUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Request rejected successfully");
        setRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status: "rejected" } : req
          )
        );
      } else {
        console.log("Failed to reject request:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Failed to reject the request:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#161717] text-white p-6">
      {loading && <Skeleton />}
      <div className="flex justify-between p-2 px-3 items-center ">
        <div>
          <Link to="/home">
            <p>Back</p>
          </Link>
        </div>
        <div className="font-bold text-lg">Message Requests</div>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-400">No requests at the moment.</p>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {requests.map((request) => {
            return (
              <div
                key={request._id}
                className="flex items-center justify-between rounded-xl shadow-sm hover:bg-[#2c2c2c] transition"
              >
                <div className="flex items-center p-3 space-x-1 ">
                  <img
                    src={request.from.profilePic || NoUser}
                    alt="User profile"
                    className="border border-slate-600 bg-slate-700 h-10 w-10 rounded-full"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <p className="font-medium">{request.from.fullname}</p>
                    <p className="text-xs text-gray-400">
                      Requested to message
                    </p>
                    {/* Show current status */}
                    {request.status !== "pending" && (
                      <p
                        className={`text-xs mt-1 ${
                          request.status === "accepted"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </p>
                    )}
                  </div>
                </div>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(request)}
                      className="bg-white text-black text-sm px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      className="border border-gray-500 text-gray-300 text-sm px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
