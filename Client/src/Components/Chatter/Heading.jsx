import React, { useEffect, useRef, useState } from "react";
import NoUser from "../../assets/nouser.png"
import { faArrowLeft, faEllipsisVertical, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Heading = ({ name, profilePic }) => {
  const options = ["View User", "Delete Chats"];
  const [isOptionVisible, setisOptionVisible] = useState(false);
  const optionsRef = useRef(null);

  const handleOptionsClick = () => {
    setisOptionVisible(!isOptionVisible);
  };

  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setisOptionVisible(false);
    }
  };
  useEffect(()=>{
    document.addEventListener("mousedown",handleClickOutside);
    return () => {
      document.removeEventListener("mousedown",handleClickOutside)
    };

 

  },[]);

  return (
    <div className="fixed left-0 right-0 w-[90%] mx-auto">

    <div className="flex bg-[#000000] p-2 rounded-lg">
      <div className="flex items-center gap-2">
        <Link to={"/home"}>
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
          <p>{name || "User"}</p>
          <p>Offline</p>
        </div>
        <div className="flex gap-5">
          <FontAwesomeIcon
            className="text-xl"
            icon={faPhone}
            style={{ color: "#ffffff" }}
          />
          <div>
            <FontAwesomeIcon
              className="text-xl w-5 h-5"
              onClick={handleOptionsClick}
              icon={faEllipsisVertical}
              style={{ color: "#ffffff" }}
            />

            {isOptionVisible && (
              <div
                ref={optionsRef}
                className="options absolute bg-[#1D1F1F]"
                style={{
                  top: "30%",
                  right: "3%",
                }}
              >
                {options.map((items, index) => {
                  return (
                    <div className="hover:bg-[#242626] p-3" key={index}>
                      {items}
                    </div>
                  );
                })}
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