import React, { useState, useEffect } from "react";
import axios from "axios";

const Requests = () => {
  const [requests, setRequests] = useState([]); // State to store requests
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://your-api-endpoint.com/api/requests"); // Replace with your API endpoint
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err.response?.data || err.message);
        setError("Failed to load requests. Please try again later.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`https://your-api-endpoint.com/api/requests/accept/${requestId}`); // Replace with your API endpoint
      setRequests((prev) => prev.filter((req) => req._id !== requestId)); // Remove the accepted request
    } catch (err) {
      console.error("Error accepting request:", err.response?.data || err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`https://your-api-endpoint.com/api/requests/reject/${requestId}`); // Replace with your API endpoint
      setRequests((prev) => prev.filter((req) => req._id !== requestId)); // Remove the rejected request
    } catch (err) {
      console.error("Error rejecting request:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return <p className="text-white text-center">Loading requests...</p>;
  }

  if (error) {
    return <p className="text-red-500 min-h-screen bg-[#161717] flex items-center justify-center">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#161717] text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Message Requests</h1>
      {requests.length === 0 ? (
        <p className="text-center text-gray-400">No requests available.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-[#2E2F2F] p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-bold">{request.from.username}</p>
                <p className="text-sm text-gray-400">{request.from.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
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