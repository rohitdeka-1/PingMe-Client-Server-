import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { jwtDecode } from "jwt-decode";
import NOUSER from "../../assets/nouser.png"
const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [searchPage, setSearchPage] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const token = localStorage.getItem("ACCESS_TOKEN");
  let loggedInUsername = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      loggedInUsername = decodedToken.username;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }
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
 
        const filteredResults = res.data.results.filter(
          (item) => item.username !== loggedInUsername
        );
        setResults(filteredResults || []);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  const handleSearch = (query) => {
    setQuery(query);
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
          className="p-3 absolute bg-[#484848] left-5 right-5 rounded-2xl"
          ref={searchRef}
        >
          {results.length > 0 ? (
            results.map((item) => (
              <Link key={item._id} to={`/profile/${item.username}`}>
                <li
                  key={item._id}
                  className="py-3 px-2 text-white hover:bg-[#141414] font-bold rounded-xl"
                >
                  <img
                  
                    src={item.profilePic ||  NOUSER }
                    alt={`${item.fullname}'s profile`}
                    className="inline-block w-8 h-8 rounded-full mr-2"
                  />
                  {item.fullname}
                </li>
              </Link>
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
