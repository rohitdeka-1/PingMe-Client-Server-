import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import ChatFilters from "../Components/Chat/ChatFilters";
import MessageCard from "../Components/Chat/MessageCard";
import Heading from "../Components/Common/Heading";
import SearchPage from "../Components/Common/searchPage";
import Skeleton from "../Components/loader/Loading";
import Request from "../Components/Chat/Request";

const Home = () => {
  const [acceptedUsers, setAcceptedUsers] = useState([]); // State for accepted users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accepted users
  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/user/accepted-users");
        console.log(response);
  
        // Extract necessary data for accepted requests
        const accepted = response.data.acceptedUsers
          .filter((req) => req && req.id)  
          .map((req) => ({
            id: req.id,
            name: req.name,
            profilePic: req.profilePic,
          }));
  
        setAcceptedUsers(accepted);
        console.log(acceptedUsers);
      } catch (err) {
        console.error("Error fetching accepted users:", err.response?.data || err.message);
        setError("Failed to load accepted users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAcceptedUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#161717] p-6">
      {loading && <Skeleton />}
      <Heading />
      <SearchPage />
      <ChatFilters />
      <Request />

      {/* Accepted Users Section */}
      <div className="mt-6">
        <h3 className="text-slate-300 text-md font-bold mb-4">Messages</h3>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : acceptedUsers.length === 0 ? (
          <p className="text-gray-400 text-center">No accepted requests at the moment.</p>
        ) : (
          <MessageCard chats={acceptedUsers} />
        )}
      </div>
    </div>
  );
};

export default Home;