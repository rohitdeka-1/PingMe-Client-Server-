import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Card = () => {
  const [selectedImage, setSelectedImage] = useState(null); 
  const [uploading, setUploading] = useState(false);
  const [Fullname, setFullname] = useState("user")

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile"); 
        const profilePic = response.data.user.profilePic;
        const fullName = response.data.user.fullname;
        setFullname(fullName)
        
        if (profilePic) {
          const imageUrl = profilePic.startsWith("http")
            ? profilePic
            : `${import.meta.env.VITE_BACKEND_URI}${profilePic}`;
          setSelectedImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);

      try {
        setUploading(true);
        const response = await axiosInstance.post("/user/edit-profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Ensure the image URL is absolute
        const imageUrl = response.data.user.profilePic.startsWith("http")
          ? response.data.user.profilePic
          : `${import.meta.env.VITE_BACKEND_URI}${response.data.user.profilePic}`;

      

        setSelectedImage(imageUrl); 
        setUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
      }
    }
  };  

  return (
    <div className="relative w-full">
      <form>
        <label htmlFor="file-upload" className="w-full cursor-pointer">
          <img
            className="border border-slate-600 h-28 w-28 rounded-full bg-black object-cover mx-auto"
            src={selectedImage || "../../assets/react.svg"} 
            alt="Avatar"
          />
          <p
            className="absolute text-white border border-slate-600 rounded-full px-1 bg-black"
            style={{
              top: "62%",
              left: "59%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </p>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          name="profilePic"
          className="hidden"
          onChange={handleFileUpload}
        />
      </form>
      {uploading && <p className="text-center text-gray-400 mt-2">Uploading...</p>}
      <div className="text-white text-lg flex justify-center items-center py-4">
        {Fullname}
      </div>
    </div>
  );
};

export default Card;  