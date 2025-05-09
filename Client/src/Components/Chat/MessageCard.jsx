import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoUser from "../../assets/nouser.png";
import { socket } from "../../utils/socket";

const MessageCard = ({ chats }) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    // Initial check for online users
    socket.emit("get-online-users", null, (onlineUserIds) => {
      setOnlineUsers(new Set(onlineUserIds));
    });

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  return (
    <div className="mt-5 mb-5 w-full">
      {chats.map((chat) => {
        // Create a unique key combining chat.id and user id
        const uniqueKey = `${chat.id}-${chat.userId || chat.participants?.[0]}`;
        
        return (
          <div
            key={uniqueKey}  // Use the unique key here
            className="py-3 px-1 flex items-center space-x-4 hover:bg-[#2E2F2F] rounded-xl"
          >
            <Link
              to={`/chat/${chat.id}`}
              state={{ name: chat.name, profilePic: chat.profilePic }}
              className="flex items-center space-x-4 w-full"
            >
              <img
                src={chat.profilePic || NoUser}
                alt="User Avatar"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-grow">
                <p className="text-white font-sans text-xl">{chat.name}</p>
                <p
                  className={`text-sm ${
                    onlineUsers.has(chat.id) ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {onlineUsers.has(chat.id) ? "Online" : "Offline"}
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default MessageCard;