import React, { useEffect, useRef, useState } from "react";
import NoUser from "../../assets/nouser.png";
import { faArrowLeft, faEllipsisVertical, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { socket } from "../../utils/socket";

const Heading = ({ name, profilePic, userId }) => {
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const optionsRef = useRef(null);
  const options =[

    "View"
  ]
  const handleOptionsClick = () => setIsOptionVisible(!isOptionVisible);

  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setIsOptionVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Check initial status
    const checkStatus = () => {
      socket.emit("get-online-status", userId, (online) => {
        setIsOnline(online);
      });
    };

    // Setup listeners
    const handleOnline = (onlineUserId) => {
      if (onlineUserId === userId) setIsOnline(true);
    };

    const handleOffline = (offlineUserId) => {
      if (offlineUserId === userId) setIsOnline(false);
    };

    socket.on("user-online", handleOnline);
    socket.on("user-offline", handleOffline);

    // Initial check with retry logic
    checkStatus();
    const statusCheckInterval = setInterval(checkStatus, 30000); // Recheck every 30s

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socket.off("user-online", handleOnline);
      socket.off("user-offline", handleOffline);
      clearInterval(statusCheckInterval);
    };
  }, [userId]);

  return (
    <div className="fixed left-0 right-0 w-[90%] mx-auto">
      <div className="flex bg-[#000000] p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Link to="/home">
            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#ffffff" }} />
          </Link>
          <img
            src={profilePic || NoUser}
            alt="User Avatar"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>

        <div className="flex px-4 justify-between w-full items-center">
          <div className="ml-1">
            <p className="text-white">{name || "User"}</p>
            <p className={`text-sm ${isOnline ? "text-green-500" : "text-gray-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
     
          <div className="flex gap-5">
            <FontAwesomeIcon
              className="text-xl cursor-pointer"
              icon={faPhone}
              style={{ color: "#ffffff" }}
            />
            <div className="relative">
              <FontAwesomeIcon
                className="text-xl w-5 h-5 cursor-pointer"
                onClick={handleOptionsClick}
                icon={faEllipsisVertical}
                style={{ color: "#ffffff" }}
              />

              {isOptionVisible && (
                <div
                  ref={optionsRef}
                  className="options absolute bg-[#1D1F1F] rounded-md shadow-lg z-10"
                  style={{
                    top: "100%",
                    right: "0",
                    minWidth: "120px",
                  }}
                >
                  {options.map((item, index) => (
                    <div
                      className="hover:bg-[#242626] p-3 text-white cursor-pointer text-sm"
                      key={index}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
