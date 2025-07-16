"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  onSnapshot,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

import Sidebar from "@/components/Sidebar";
import Post from "@/components/Post";
import Comment from "@/components/Comment";
import Widgets from "@/components/Widgets";
import { ArrowLeft } from "lucide-react";
import Modal from "@/components/Modal";

export default function PostPage({
  id,
  session,
  trendingResults,
  followResults,
}) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id) return;
    return onSnapshot(doc(db, "posts", id), (snapshot) => {
      setPost(snapshot.data());
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    return onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [id]);

  return (
    <div className="bg-black min-h-screen">
      <div className="flex max-w-[1500px] mx-auto">
        <Sidebar session={session} />

        <main className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <button
              onClick={() => router.push("/")}
              className="hover:underline text-white flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" /> Posts
            </button>
          </div>

          {post ? (
            <>
              <Post id={id} post={post} postPage session={session} />
              {comments.length > 0 && (
                <div className="pb-72">
                  {comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      id={comment.id}
                      comment={{ ...comment.data(), postId: id }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500 text-center mt-10">
              Loading post...
            </div>
          )}
        </main>

        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        <Modal session={session} />
      </div>
    </div>
  );
}
