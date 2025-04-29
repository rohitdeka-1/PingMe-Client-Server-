import { faCircleQuestion, faLink, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputField = ({ icon, placeholder, isTextArea = false }) => {
  return (
    <div className={`flex ${isTextArea ? "" : "items-center"} gap-2`}>
      <FontAwesomeIcon className="text-xl" icon={icon} style={{ color: "#ffffff" }} />
      {isTextArea ? (
        <textarea
          className="bg-[#00000000] outline-none px-2 py-1 w-full"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="bg-[#00000000] outline-none px-2 py-1 w-full"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

const Name = () => {
  return (
    <div className="text-white px-4 mt-20 w-full">
      <div className="flex flex-col gap-6">
        <InputField icon={faUser} placeholder="Edit Name" />
        <InputField icon={faCircleQuestion} placeholder="Edit About" />
        <InputField icon={faLink} placeholder="Edit About" isTextArea={true} />
        <button className="border rounded-xl p-2 flex mt-10 justify-center items-center bg-green-900">
          Save
        </button>
      </div>
    </div>
  );
};

export default Name;