import { useState } from "react";

const ChatFilters = () => {
  const [activeTab, setActiveTab] = useState("All");
  const options = ["All", "Unread", "Favourites"];
  const handleActive = (items) => {
    setActiveTab(items);
  };
  return (
    <div className="text-slate-400 flex space-x-3">
      {options.map((items, index) => {
        return (    
          <span
            onClick={() => handleActive(items)}
            className={` border border-slate-600 ${
              activeTab == items ? "bg-[#242626]" : ""
            }  px-3 py-1 rounded-2xl`}
            key={index}
          >
            {items}
          </span>
        );  
      })}
    </div>
  );
};

export default ChatFilters;
