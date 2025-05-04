import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [searchPage, setSearchPage] = useState(false);
  const [query, setQuery] = useState("");  
  const searchRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query === "") {
        setResults([]);
        return;
      }
      try {
        const res = await axiosInstance.get(`search?q=${query}&limit=8`);
        console.log("Search results:", res.data);
        setResults(res.data.results || []);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      }
    }, 300) // Adjust debounce delay as needed
  ).current;

  // Trigger debounced search when query changes
  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel(); // Cancel any pending debounced calls
    };
  }, [query]);

  const handleSearch = (query) => {
    setQuery(query); // Update the query state
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchPage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setSearchPage(!searchPage);
  };

  return (
    <div className="py-4">
      <SearchBar onSearch={handleSearch} onClick={handleClick} />
      {searchPage && (
        <ul
          className="p-2 absolute bg-[#282828] left-5 right-5 rounded-2xl"
          ref={searchRef}
        >
          {results.length > 0 ? (
            results.map((item) => (
              <li
                key={item._id}
                className="p-2 text-white hover:bg-[#141414] rounded-xl"
              >
                <Link to={`/profile/${item.username}`} >{item.fullname}</Link>
              </li>
            ))
          ) : (
            <li className="p-2 text-white">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;