"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useLocation } from "react-router-dom"
import Heading from "../Components/Chatter/Heading"
import Background from "../../src/assets/background.webp"
import TextArea from "../Components/Chatter/TextArea"
import Skeleton from "../Components/loader/Loading"
import { socket } from "../utils/socket"
import axiosInstance from "../utils/axiosInstance"

const Chat = () => {
  const { userId } = useParams()
  const location = useLocation()
  const { name, profilePic } = location.state || {}

  const [chatData, setChatData] = useState({ messages: [], currentUserId: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const processedMessageIds = useRef(new Set())

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/chat/${userId}`)
        console.log("Current User ID:", response.data.currentUserId)

        // Process messages in chronological order (oldest first)
        const messages = response.data.messages || []
        messages.forEach((msg) => {
          if (msg._id) {
            processedMessageIds.current.add(msg._id)
          }
        })

        setChatData({
          messages: messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
          currentUserId: response.data.currentUserId,
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to load chat. Please try again later.")
        setLoading(false)
        console.error("Error fetching chat:", err)
      }
    }

    fetchChatData()

    const setupSocket = () => {
      if (!socket.connected) {
        socket.connect()
      }

      socket.off("receive-message")

      socket.on("receive-message", (message) => {
        console.log("Received message via socket:", message)

        if (message._id && processedMessageIds.current.has(message._id)) {
          console.log("Skipping duplicate message:", message._id)
          return
        }

        if (message._id) {
          processedMessageIds.current.add(message._id)
        }

        // Add new message to the end of the array
        setChatData((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      })
    }

    setupSocket()

    return () => {
      socket.off("receive-message")
    }
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [chatData.messages])

  const handleSendMessage = (content) => {
    if (!content.trim()) return

    const tempId = `temp-${Date.now()}`
    const message = {
      _id: tempId,
      senderId: { _id: chatData.currentUserId },
      receiverId: userId,
      content,
      timestamp: new Date().toISOString(),
    }

    processedMessageIds.current.add(tempId)

    // Add new message to the end
    setChatData((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))

    socket.emit("send-message", { to: userId, content }, (acknowledgement) => {
      console.log("Message sent acknowledgement:", acknowledgement)

      if (acknowledgement && acknowledgement.messageId) {
        processedMessageIds.current.add(acknowledgement.messageId)

        setChatData((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) => 
            msg._id === tempId ? { ...msg, _id: acknowledgement.messageId } : msg
          ),
        }))
      }
    })
  }

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return <p className="min-h-screen flex justify-center bg-black items-center text-red-500 text-center">{error}</p>
  }

  return (
    <div className="min-h-screen bg-[#161717] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundAttachment: "fixed",
          opacity: "70%",
        }}
      ></div>

      <div className="relative z-10 flex mt-2 flex-col h-full">
        <Heading name={name} profilePic={profilePic} />
        <div className="flex-grow ml-1 mt-[70px] mb-[70px] w-full text-md overflow-y-auto p-4">
          {chatData.messages.map((msg, index) => {
            const msgSenderId = typeof msg.senderId === "object" ? msg.senderId?._id || "" : msg.senderId
            const isCurrentUser = String(msgSenderId) === String(chatData.currentUserId)

            return (
              <div
                key={msg._id || index}
                className={`mb-2 max-w-[70%] px-3 py-2 rounded-xl ${
                  isCurrentUser ? "bg-blue-500 text-white ml-auto" : "bg-gray-700 text-white self-start"
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <p className="text-slate-400 text-sm text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        <TextArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default Chat