import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Skeleton from "../Components/loader/Loading";

const Public = () => {
  const { username } = useParams();

  const [user, setUser] = useState({
    profilePhoto: "",
    gallary: [],
    fullname: "",
    about: "",
    username: "",
  });
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    (async function fetchUser() {
      try {
        setisLoading(true);
        const res = await axiosInstance.get(`/user/profile/${username}`);
        
        toast.success("User fetched");

        setUser({
          profilePhoto: res.data.user.profilePic,
          about: res.data.user.about,
          fullname: res.data.user.fullname,
          gallary: res.data.user.userImages,
          username: res.data.user.username,
        });
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      } finally {
        setisLoading(false);
      }
    })();
  }, [username]);

  return (
    
    <div className="min-h-screen bg-[#131313] text-white px-3 py-4">
      {
        isLoading && <Skeleton/>
      }
      <div className="title  text-xl  font-sans py-3 font-semibold tracking-[1px]">
      {user.fullname}
      </div>
      <div className="flex flex-col justify-center items-center mt-4 gap-4">
        <div className="border rounded-full h-28 w-28 overflow-hidden">
          { user.profilePhoto!=="" && 
          <img
            className="object-cover w-full h-full"
            src={`${user.profilePhoto}`}
            alt="User Avatar"
          />
        }
        </div>
        <div>
          <p className="text-lg"> {user.username}</p>
        </div>
        <div>
          <p className="text-justify ">{user.about}</p>
        </div>
      </div>

      <div className="flex  justify-center gap-6 p-4">
        <button className="bg-[#699bba] p-3 hover:bg-[#4e748b] transition ease-in-out duration-300 w-full rounded-2xl">
          Message
        </button>
        <button className="bg-[#699bba] p-3 hover:bg-[#4e748b] transition ease-in-out duration-300 w-full rounded-2xl">
          Request
        </button>
      </div>

      <div className=" p-4 mt-4">
        <div className="container grid grid-cols-2 grid-rows-2 gap-4">
          {user?.gallary?.length > 0 &&
            user?.gallary?.map((item, index) => (
              <img
                key={index}
                src={item}
                className="h-40 w-full object-cover rounded-lg"
                alt={`Image ${index + 1}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Public;
