 
import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import Heading from "../Components/Chatter/Heading"
import Background from "../../src/assets/background.webp"
import TextArea from "../Components/Chatter/TextArea"
import Skeleton from "../Components/loader/Loading"
import { socket } from "../utils/socket"
import axiosInstance from "../utils/axiosInstance"

const Chat = () => {
  const { userId } = useParams() // Get the user ID from the route parameter
  const location = useLocation() // Access the state passed via Link
  const { name, profilePic } = location.state || {} // Destructure additional data

  const [chatData, setChatData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true)
        // Fetch chat messages from the backend
        const response = await axiosInstance.get(`/chat/${userId}`)
        console.log("Current User ID:", response.data.currentUserId) // Debug log
        console.log("Messages:", response.data.messages)
        setChatData({
          messages: response.data.messages,
          currentUserId: response.data.currentUserId,
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to load chat. Please try again later.")
        setLoading(false)
        console.log(err)
      }
    }

    fetchChatData()

    // Listen for incoming messages
    socket.on("receive-message", (message) => {
      setChatData((prev) => {
        if (!prev) return prev
        // Check if message already exists to prevent duplicates
        const messageExists = prev.messages.some(
          (msg) =>
            msg._id === message._id ||
            (msg.content === message.content &&
              msg.senderId._id === message.senderId &&
              msg.timestamp === message.timestamp),
        )

        if (messageExists) return prev

        return {
          ...prev,
          messages: [...prev.messages, message],
        }
      })
    })

    return () => {
      socket.off("receive-message")
    }
  }, [userId])

  const handleSendMessage = (content) => {
    if (!content.trim()) return

    const message = {
      senderId: { _id: chatData.currentUserId },
      receiverId: userId,
      content,
      timestamp: new Date().toISOString(),
    }

    // Emit the message to the server
    socket.emit("send-message", { to: userId, content })

    // Optimistically update the chat UI
    setChatData((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))
  }

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return <p className="min-h-screen flex justify-center bg-black items-center text-red-500 text-center">{error}</p>
  }

  return (
    <div className="min-h-screen bg-[#161717] text-white relative overflow-hidden">
      {/* Fixed Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundAttachment: "fixed", // Fix the background
          opacity: "70%",
        }}
      ></div>

      {/* Chat Content */}
      <div className="relative z-10 flex mt-2 flex-col h-full">
        <Heading name={name} profilePic={profilePic} />
        <div className="flex-grow ml-1 mt-[70px] mb-[70px] w-full text-md overflow-y-auto p-4">
          {chatData?.messages.map((msg, index) => {
            // Convert IDs to strings for proper comparison
            const msgSenderId = msg.senderId._id || msg.senderId
            const currentUserId = chatData.currentUserId

            // Compare as strings to ensure proper alignment
            const isCurrentUser = String(msgSenderId) === String(currentUserId)

            return (
              <div
                key={msg._id || index}
                className={`mb-2 max-w-[70%] px-3 py-2 rounded-xl ${
                  isCurrentUser
                    ? "bg-blue-500 text-white ml-auto" // Messages from the current user
                    : "bg-gray-700 text-white self-start" // Messages from the sender
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <p className="text-slate-400 text-sm text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            )
          })}
        </div>

        <TextArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default Chat
