import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const SearchBar = ({ onSearch, onClick }) => {
  const [input, setInput] = useState("");


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (input.trim()) {
        onSearch(input);
      } else {
        onSearch(""); 
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [input, onSearch]);

  
  return (
    <div className="py-4 relative w-full">
      <FontAwesomeIcon
        className="text-[#838383] absolute top-1/2 left-4 transform -translate-y-1/2 "
        icon={faSearch}
      />
      <input
        className="text-white rounded-3xl px-10  py-2 bg-[#2E2F2F] w-full focus:outline-white"
        placeholder="Search chat"
        onChange={(e) => setInput(e.target.value)}
        onClick={onClick}
        value={input}
      ></input>
    </div>
  );
};

export default SearchBar;
