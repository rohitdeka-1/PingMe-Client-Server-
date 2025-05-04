import Skeleton from "../Components/loader/Loading";
import Card from "../Components/Profile/Card";
import Heading from "../Components/Profile/Heading";
import Name from "../Components/Profile/Name";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const [fullname, setFullname] = useState("");
  const [about, setAbout] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userImages, setUserImages] = useState([]);
 
  const maxImages = 4;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setFullname(res.data.user.fullname);
        setAbout(res.data.user.about);
        setUserImages(res.data.user.userImages || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        
          setIsLoading(false)  
        
      }
    };
    getUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  
      const response = await axiosInstance.post("/user/edit-profile", {
        fullname,
        about,
      });

      toast.success(response.data.message);
      console.log("Response:", response.data);
    } catch (error) {
      const errorMessage = error?.response.data.message;
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    } 
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("gallery", file);  

      try {
        const response = await axiosInstance.post(
          "/user/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

 
        setUserImages((prevImages) => [...prevImages, response.data.imageUrl]);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#161717]">
      {isLoading && (
        <Skeleton/>
      )}
      <div className={`p-4 ${isLoading ? "blur-sm pointer-events-none" : ""}`}>
        <Heading />
        <Card />
        <Name
          fullname={fullname}
          setFullname={setFullname}
          about={about}
          setAbout={setAbout}
          onSubmit={handleSubmit}
        />
        <div className="p-4 mt-2">
          <div className="container grid grid-cols-2 grid-rows-2 gap-4">
            {Array.from({ length: maxImages }).map((_, index) => {
              if (index < userImages.length) {
                
                return (
                  <img
                    key={index}
                    src={userImages[index]}
                    className="h-40 w-full object-cover rounded-lg"
                    alt={`Image ${index + 1}`}
                  />
                );
              } else {
                
                return (
                  <div key={index} className="relative">
                    <button
                      className="h-40 w-full border-dashed border-2 border-gray-500 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-700 hover:text-white transition ease-in-out duration-300"
                      onClick={() =>
                        document.getElementById(`image-upload-${index}`).click()
                      }
                    >
                      +
                    </button>
                    <input
                      id={`image-upload-${index}`}
                      type="file"
                      name="gallery"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;