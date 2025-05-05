import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatFilters from "../Components/Chat/ChatFilters";
import MessageCard from "../Components/Chat/MessageCard";
import Heading from "../Components/Common/Heading";
import SearchBar from "../Components/Common/SearchBar";
import Request from "../Components/Chat/Request";
import SearchPage from "../Components/Common/searchPage";
import Skeleton from "../Components/loader/Loading";
// import axiosInstance from "../utils/axiosInstance";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
 

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
       
        const response = await axios.get("https://your-api-endpoint.com/api/chats");  
        setChats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chats:", err.response?.data || err.message);
        setError("Failed to load chats. Please try again later.");
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-[#161717] p-6">
         {loading && (
        <Skeleton/>
      )}
      <Heading   />
     
      <SearchPage onSearch={(term) => setSearchTerm(term)} />
      <ChatFilters />
      <Request/>
      {loading ? (
        <p className="text-white text-center">Loading chats...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredChats.length === 0 ? (
        <p className="text-white text-center">No chats available.</p>
      ) : (
        <MessageCard chats={filteredChats} />
      )}
    </div>
  );
};

export default Home;