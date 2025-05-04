
import Card from "../Components/Profile/Card"
import Heading from "../Components/Profile/Heading"
import Name from "../Components/Profile/Name"
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"

const Profile = () => {
  
    const [fullname, setFullname] = useState("");  
    const [about, setAbout] = useState("");  


    useEffect( ()=>{
      const getUserData = async() =>{
        const res = await axiosInstance.get("/user/profile");
        setFullname(res.data.user.fullname)
        setAbout(res.data.user.about)
      }
      getUserData();
    },[])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/edit-profile", {
        fullname,
        about,
      });

        toast.success(response.data.message)
      console.log("Response:", response.data);
      
    } catch (error) {
      const errorMessage = error?.response.data.message;
      
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    }
  };

  

  const array = [
    "/vite.svg",
 
  ];
  const maxImages = 4; 
  return (
    <div className="min-h-screen bg-[#161717] p-4">
      <Heading />
      <Card />
      <Name
        fullname={fullname}
        setFullname={setFullname}
        about={about}
        setAbout={setAbout}
        onSubmit={handleSubmit}
      />
      <div className=" p-4 mt-2">
        <div className="container grid grid-cols-2 grid-rows-2 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => {
            if (index < array.length) {
              // Render image if it exists in the array
              return (
                <img
                  key={index}
                  src={array[index]}
                  className="h-40 w-full object-cover rounded-lg"
                  alt={`Image ${index + 1}`}
                />
              );
            } else {
              // Render "+" skeleton button for empty slots
              return (
                <button
                  key={index}
                  className="h-40 w-full border-dashed border-2 border-gray-500 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-700 hover:text-white transition ease-in-out duration-300"
                >
                  +
                </button>
              );
            }
          })}
        </div>
      </div>

    </div>
  )
}

export default Profile