import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import NoUser from "../../assets/nouser.png";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        console.error(
          "Error fetching requests:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load requests. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      await axiosInstance.post(
        `/requests/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error(
        "Error accepting request:",
        err.response?.data || err.message
      );
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      await axiosInstance.post(
        `/requests/reject/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error(
        "Error rejecting request:",
        err.response?.data || err.message
      );
    }
  };

  if (loading) {
    return <p className="text-white text-center">Loading requests...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 min-h-screen bg-[#161717] flex items-center justify-center">
        {error}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#161717] text-white p-6">
      <div className="flex justify-between p-2 px-3 items-center ">
        <div>
          <Link to={`/home`}>
          <p> Back</p>
          </Link>
        </div>
        <div className="font-bold text-lg">
            Message Requests
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-400">No requests at the moment.</p>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {requests.map((request) => (
            <div
              key={request.from._id}
              className="flex items-center justify-between  rounded-xl shadow-sm hover:bg-[#2c2c2c] transition"
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
                  <p className="text-xs text-gray-400">Requested to message</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="bg-white text-black text-sm px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="border border-gray-500 text-gray-300 text-sm px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
