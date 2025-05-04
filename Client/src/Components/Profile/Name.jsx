import { faCircleQuestion, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const InputField = ({ icon, placeholder, value, onChange, isTextArea = false, maxLength = 41 }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value); 
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
            value={value}
            onChange={handleInputChange}
          />
        ) : (
          <input
            type="text"
            className="bg-[#00000000] outline-none px-2 py-1 w-full"
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onChange={handleInputChange}
          />
        )}
      </div>
      {isTextArea && (
        <p className={`text-sm text-right ${value.length === maxLength ? "text-red-500" : "text-gray-400"}`}>
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

const Name = ({ fullname, setFullname, about, setAbout, onSubmit }) => {
  return (
    <div className="text-white px-4 mt-3 w-full">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <InputField
            icon={faUser}
            placeholder="Edit Name"
            value={fullname}
            onChange={setFullname}
          />
          <InputField
            icon={faCircleQuestion}
            placeholder="Edit About"
            value={about}
            onChange={setAbout}
            isTextArea={true}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-800 transition ease-in-out duration-200 rounded-xl p-2 w-full text-white"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Name;