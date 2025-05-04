import { faCircleQuestion, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const InputField = ({ icon, placeholder, isTextArea = false, maxLength = 41 }) => {
  const [charCount, setCharCount] = useState(0); // State to track character count

  const handleInputChange = (e) => {
    setCharCount(e.target.value.length);  
  };

  return (
    <div className={`flex flex-col gap-1 ${isTextArea ? "" : "items-center"} gap-2`}>
      <div className="flex w-full items-center gap-2">
        <FontAwesomeIcon className="text-xl" icon={icon} style={{ color: "#ffffff" }} />
        {isTextArea ? (   
          <input
            className="bg-[#00000000] outline-none px-2 py-1 w-full"
            placeholder={placeholder}
            maxLength={maxLength} 
            onChange={handleInputChange} 
          /> //acting as a textArea 
        ) : (
          <input
            type="text"
            className="bg-[#00000000] outline-none px-2 py-1 w-full"
            placeholder={placeholder}
          />
        )}
      </div>
      {isTextArea && (
        <p className={`text-sm text-right ${charCount === maxLength ? "text-red-500" : "text-gray-400"}`}>
          {charCount}/{maxLength}
        </p>
      )}
    </div>
  );
};

const Name = () => {
  return (
    <div className="text-white px-4 mt-14 w-full">
      <div className="flex flex-col gap-6">
        <InputField icon={faUser} placeholder="Edit Name" />
        <InputField icon={faCircleQuestion} placeholder="Edit About" isTextArea={true} />
      </div>
    </div>
  );
};

export default Name;