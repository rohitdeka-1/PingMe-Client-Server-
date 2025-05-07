import React, { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import NOUSER from "../../assets/nouser.png"

const Avatar = () => {
  const [profilePhoto, setprofilePhoto] = useState("");

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setprofilePhoto(response.data.user.profilePic);
   
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPhoto();
  }, []);

  return (
    <div>
      <img
        src={profilePhoto || NOUSER }
        alt="User profile"
        className="border border-slate-600 bg-slate-700 h-12 w-12 rounded-full"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default Avatar;
