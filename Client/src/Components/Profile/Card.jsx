import Dummy1 from "../../assets/react.svg";
// import Dummy2 from "../../assets/ran4.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";


const Card = () => {
  return (
    <div className="relative w-full">
      <div className="w-full">
        <img
          className="border border-slate-600 p-9 rounded-full bg-black mx-auto"
          src={Dummy1}
          alt="Avatar"
        />

        <p
          className="absolute text-white border  border-slate-600 rounded-full px-1 bg-black"
          style={{
            top: "72%",
            left: "59%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <FontAwesomeIcon icon={faArrowUpFromBracket} />
        </p>
      </div>
      
    </div>
  );
};

export default Card;
