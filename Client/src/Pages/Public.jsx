import React from "react";

const Public = () => {
  const array = [
    "/vite.svg",
    "/ran4.jpeg",
    "/guava.jpg",
    "/blue.jpg",
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-white px-3 py-4">
      <div className="title  text-xl  font-sans py-3 font-semibold tracking-[1px]">UserName</div>
      <div className="flex flex-col justify-center items-center mt-4 gap-4">
        <div className="border rounded-full h-28 w-28 overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src="/ran4.jpeg"
            alt="User Avatar"
          ></img>
        </div>
        <div>
          <p className="text-lg">FullName</p>
        </div>
        <div>
          <p className="text-justify ">
            Lorem ipsum dolor sit amet consectetur.
          </p>
        </div>
      </div>

      <div className="flex  justify-center gap-6 p-4">
      <button className="bg-[#699bba] p-3 hover:bg-[#4e748b] transition ease-in-out duration-300 w-full rounded-2xl">
          Message
        </button>
        <button className="bg-[#699bba] p-3 hover:bg-[#4e748b] transition ease-in-out duration-300 w-full rounded-2xl">
          Request
        </button>
      </div>

      <div className=" p-4 mt-4">
        <div className="container grid grid-cols-2 grid-rows-2 gap-4">
          {array.map((item, index) => (
            <img
              key={index}
              src={item}
              className="h-40 w-full object-cover rounded-lg"
              alt={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Public;
