import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const SearchBar = () => {
  return (
    <div className="py-4 relative">
      <FontAwesomeIcon className="text-[#838383] absolute top-1/2 left-4 transform -translate-y-1/2 " icon={faSearch} />
    <input className="text-white rounded-3xl px-10 py-2 bg-[#2E2F2F] w-full focus:outline-white" placeholder="Search chat"></input>
    </div>
  )
} 

export default SearchBar