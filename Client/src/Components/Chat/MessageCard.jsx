import { Link } from "react-router-dom";
import NoUser from "../../assets/nouser.png";

const MessageCard = ({ chats }) => {
  return (
    <div className="mt-5 mb-5 w-full">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="py-3 px-1 flex items-center space-x-4 hover:bg-[#2E2F2F] rounded-xl"
        >
          <Link to={`/chat/${chat.id}`} className="flex items-center space-x-4 w-full">
            <img
              src={chat.profilePic || NoUser}
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-grow">
              <p className="text-white font-sans text-xl">{chat.name}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MessageCard;