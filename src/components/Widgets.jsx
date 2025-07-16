import { Search } from "lucide-react";
import Trending from "./Trending";
import Image from "next/image";

const Widgets = ({ trendingResults, followResults }) => {
  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      <div className="sticky top-0 py-1.5 bg-black xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
          <Search className="text-gray-500 h-5 z-50" />
          <input
            type="text"
            placeholder="Search Startica"
            className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
          />
        </div>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">What's happening</h4>
        {trendingResults.map((result, index) => (
          <Trending key={index} result={result} />
        ))}
        <button className="px-4 py-3 w-full text-left text-blue-400 font-medium hover:bg-white/5 transition duration-200 rounded-b-xl">
          Show more
        </button>
      </div>

      <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-9/12">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        {followResults.map((result, index) => (
          <div
            key={index}
            className="group px-4 py-3 flex items-center transition duration-200 ease-out hover:bg-white/5 cursor-pointer"
          >
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden shrink-0">
              <Image
                src={result.userImg}
                alt="Trending Profile Pictures"
                width={50}
                height={50}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="ml-4 leading-5">
              <h4 className="font-semibold group-hover:underline">
                {result.username}
              </h4>
              <h5 className="text-gray-500 text-[15px]">{result.tag}</h5>
            </div>
            <button className="ml-auto bg-white text-black hover:bg-gray-200 rounded-full font-semibold text-sm py-1.5 px-4 transition duration-200">
              Follow
            </button>
          </div>
        ))}
        <button className="px-4 py-3 w-full text-left text-blue-400 font-medium hover:bg-white/5 transition duration-200 rounded-b-xl">
          Show more
        </button>
      </div>
    </div>
  );
};

export default Widgets;
