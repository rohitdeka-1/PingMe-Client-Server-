"use client"

import { useEffect, useState } from "react"
import axiosInstance from "../utils/axiosInstance"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import Skeleton from "../Components/loader/Loading"
import GoBack from "../Components/Common/GoBack"
import NOUSER from "../assets/nouser.png"

const Public = () => {
  const { username } = useParams()

  const [user, setUser] = useState({
    _id: "",
    profilePhoto: "",
    gallary: [],
    fullname: "",
    about: "",
    username: "",
  })
  const [isLoading, setisLoading] = useState(false)
  const [hasSentRequest, setHasSentRequest] = useState(false)

  const fetchUserProfile = async () => {
    try {
      setisLoading(true)
      const res = await axiosInstance.get(`/user/profile/${username}`)
      console.log("API Response:", res.data)

      if (res.data.success && res.data.user) {
        const { _id, profilePic, about, fullname, username, userImages } = res.data.user

        setUser({
          _id: _id || "",
          profilePhoto: profilePic || "",
          about: about || "",
          fullname: fullname || "",
          gallary: userImages || [],
          username: username || "",
        })

        console.log("Setting hasSentRequest to:", res.data.hasSentRequest)
        setHasSentRequest(res.data.hasSentRequest || false)
      } else {
        toast.error("Failed to fetch user data.")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      const errorMessage = error.response?.data?.message || "Failed to fetch user."
      toast.error(errorMessage)
    } finally {
      setisLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [username])

  const handleRequest = async () => {
    try {
      const res = await axiosInstance.post(`/user/request/${user._id}`)
      console.log("Request response:", res.data)
      toast.success(res.data.message)

      
      if (res.data.hasSentRequest !== undefined) {
       
        setHasSentRequest(res.data.hasSentRequest)
      } else {
 
        setHasSentRequest((prev) => !prev)
      }

      
      fetchUserProfile()
    } catch (error) {
      console.error("Error handling request:", error)
      const errorMessage = error.response?.data?.message || "Something went wrong"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-[#131313] text-white px-3 py-4">
      {isLoading && <Skeleton />}
      <div className="title text-xl font-sans py-3 font-semibold tracking-[1px]">{user.fullname}</div>
      <div className="flex flex-col justify-center items-center mt-4 gap-4">
        <div className="border rounded-full h-28 w-28 overflow-hidden">
          <img className="object-cover w-full h-full" src={user.profilePhoto || NOUSER} alt="User Avatar" />
        </div>
        <div>
          <p className="text-lg"> {user.username}</p>
        </div>
        <div>
          <p className="text-justify">{user.about}</p>
        </div>
      </div>

      <div className="flex justify-center gap-6 p-4">
        <button className="bg-[#282e32] p-3 hover:bg-slate-800 transition ease-in-out duration-300 w-full rounded-2xl">
          Message
        </button>
        <button
          onClick={handleRequest}
          className={`p-3 hover:bg-slate-800 transition ease-in-out duration-300 w-full rounded-2xl ${
            hasSentRequest ? "bg-blue-500" : "bg-green-600"
          }`}
        >
          {hasSentRequest ? "Unsend Request" : "Send Request"}
        </button>
      </div>

      {user.gallary.length > 0 && (
        <div className="p-4 mt-4">
          <div className="container grid grid-cols-2 grid-rows-2 gap-4">
            {user.gallary.map((item, index) => (
              <img
                key={index}
                src={item || "/placeholder.svg"}
                className="h-40 w-full object-cover rounded-lg"
                alt={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <GoBack topmargin={4} />
    </div>
  )
}

export default Public
