"use client";

import { SparklesIcon } from "lucide-react";
import Input from "./Input";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/../firebase";
import Post from "./Post";

const Feed = ({ session }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, []);

  return (
    <div className="text-white flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      <Input session={session} />
      <div className="pb-72">
        {posts.map((post) => {
          const postData = post.data();
          return (
            <Post
              key={post.id}
              id={post.id}
              post={postData}
              session={session}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
