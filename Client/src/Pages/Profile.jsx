
import Card from "../Components/Profile/Card"
import Heading from "../Components/Profile/Heading"
import Name from "../Components/Profile/Name"


const Profile = () => {

  const array = [
    "/vite.svg",
 
  ];
  const maxImages = 4; 
  return (
    <div className='min-h-screen bg-[#161717] p-4'>
        <Heading/>
        <Card/>
        <Name/>

      <div className=" p-4 mt-2">
        <div className="container grid grid-cols-2 grid-rows-2 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => {
            if (index < array.length) {
              // Render image if it exists in the array
              return (
                <img
                  key={index}
                  src={array[index]}
                  className="h-40 w-full object-cover rounded-lg"
                  alt={`Image ${index + 1}`}
                />
              );
            } else {
              // Render "+" skeleton button for empty slots
              return (
                <button
                  key={index}
                  className="h-40 w-full border-dashed border-2 border-gray-500 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-700 hover:text-white transition ease-in-out duration-300"
                >
                  +
                </button>
              );
            }
          })}
        </div>
      </div>
      <button className="border w-full bg-green-600 hover:bg-green-800 transition ease-in-out duration-200 rounded-xl p-2 flex mt-10 justify-center items-center ">
          Save
        </button>
    </div>
  )
}

export default Profile