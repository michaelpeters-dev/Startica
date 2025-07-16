import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

const Trending = ({ result }) => {
  return (
    <div className="px-4 py-3 cursor-pointer hover:bg-white/5 transition duration-200 ease-out flex items-center justify-between rounded-xl">
      <div className="space-y-0.5 group">
        <p className="text-[#6e767d] text-xs font-medium">{result.heading}</p>
        <h6 className="font-bold max-w-[250px] text-sm group-hover:underline">
          {result.description}
        </h6>
        <p className="text-[#6e767d] text-xs font-medium max-w-[250px]">
          Trending with{" "}
          {result.tags.map((tag, i) => (
            <span key={i} className="text-[#1d9bf0] hover:underline">
              {tag}
              {i < result.tags.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>
      {result.img ? (
        <Image
          src={result.img}
          width={70}
          height={70}
          alt="Trending"
          className="rounded-2xl object-cover"
        />
      ) : (
        <div className="icon group">
          <MoreHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
        </div>
      )}
    </div>
  );
};

export default Trending;
