import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const MessageCard = ({ chats }) => {
  return (
    <div className="mt-5 mb-5 py-3 px-1 flex flex-col w-full hover:bg-[#2E2F2F] rounded-xl">
      {chats.map((chat) => (
        <Link to={`/chat/${chat.id}`} key={chat.id} className="flex items-center space-x-4 py-2">
          <Avatar />
          <div className="flex-grow">
            <p className="text-white font-sans text-xl">{chat.name}</p>
            <p className="text-[1rem] text-slate-400">{chat.message}</p>
          </div>
          <div className="text-slate-400">{chat.time}</div>
        </Link>
      ))}
    </div>
  );
};

export default MessageCard;