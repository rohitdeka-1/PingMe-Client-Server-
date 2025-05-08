  import React, { useState, useEffect } from "react";
  import { useParams } from "react-router-dom";
  import Heading from "../Components/Chatter/Heading";
  import Background from "../../src/assets/background.webp";
  import TextArea from "../Components/Chatter/TextArea";
  // import axios from "axios";
  import Skeleton from "../Components/loader/Loading";

  const Chat = () => {
    const { userId } = useParams();  
    const [chatData, setChatData] = useState(null);  
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  

    useEffect(() => {
      const fetchChatData = async () => {
        try {
          setLoading(true);
          // const response = await axios.get(`/chats/${userId}`);  
          setChatData("in developement");
          setLoading(false);
        } catch {
          // console.error("Error fetching chat data:", err.response?.data || err.message);
          setError("Failed to load chat. Please try again later.");
          setLoading(false);
        }
      };

      fetchChatData();
    }, [userId]);

    if (loading) {
      
      <Skeleton/>;
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
          {/* <div className="flex-grow w-full mt-1 overflow-y-auto"> */}
            {/* Display chat messages */}
            {/* {chatData.messages.map((msg) => ( */}
              {/* <div key={msg.id} className="mb-2"> */}
                {/* <p className="text-white">{msg.content}</p> */}
                {/* <p className="text-slate-400 text-sm">{new Date(msg.timestamp).toLocaleTimeString()}</p> */}
              {/* </div> */}
            {/* ))} */}
          {/* </div> */}
          <TextArea />
        </div>
      </div>
    );
  };

  export default Chat;