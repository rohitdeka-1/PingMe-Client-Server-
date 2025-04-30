import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Heading from "../Components/Chatter/Heading";
import Background from "../../src/assets/background.webp";
import TextArea from "../Components/Chatter/TextArea";
import axios from "axios";

const Chat = () => {
  const { userId } = useParams(); // Get userId from the URL
  const [chatData, setChatData] = useState(null); // State to store chat data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://your-api-endpoint.com/api/chats/${userId}`); // Replace with your API endpoint
        setChatData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat data:", err.response?.data || err.message);
        setError("Failed to load chat. Please try again later.");
        setLoading(false);
      }
    };

    fetchChatData();
  }, [userId]);

  if (loading) {
    return <p className="text-white text-center">Loading chat...</p>;
  }

  if (error) {
    return <p className="min-h-screen flex justify-center bg-black  items-center text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#161717] text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={Background}
          className="w-full h-full object-cover rounded-lg"
          style={{
            opacity: "70%",
          }}
        />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <Heading />
        <div className="flex-grow w-full mt-1 overflow-y-auto">
          {/* Display chat messages */}
          {chatData.messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <p className="text-white">{msg.content}</p>
              <p className="text-slate-400 text-sm">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
        <TextArea />
      </div>
    </div>
  );
};

export default Chat;