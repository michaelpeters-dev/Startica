"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/../firebase";
import Moment from "react-moment";

export default function Comment({ comment, id }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  // Fetch likes from Firestore
  useEffect(() => {
    if (!id || !comment?.postId) return;
    return onSnapshot(
      collection(db, "posts", comment.postId, "comments", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [id, comment?.postId]);

  // Check if current user has liked
  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes, session]);

  // Like/unlike handler
  const handleLike = async () => {
    if (!session?.user?.uid) return;

    const likeRef = doc(
      db,
      "posts",
      comment.postId,
      "comments",
      id,
      "likes",
      session.user.uid
    );

    if (hasLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, {
        username: session.user.name,
      });
    }
  };

  return (
    <div className="p-3 flex cursor-pointer border-b border-gray-700">
      <img
        src={comment?.userImg}
        alt=""
        className="h-11 w-11 rounded-full mr-4"
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                {comment?.username}
              </h4>
              <span className="ml-1.5 text-sm sm:text-[15px]">
                @{comment?.tag}
              </span>
            </div>
            <span className="ml-1.5 text-sm sm:text-[15px]">
              · <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
            <p className="text-[#d9d9d9] mt-0.5 text-[15px] sm:text-base">
              {comment?.comment}
            </p>
          </div>
          <div className="icon group flex-shrink-0">
            <MoreHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>

        <div className="text-[#6e767d] flex justify-between w-10/12">
          <div className="icon group">
            <MessageCircle className="h-5 group-hover:text-[#1d9bf0]" />
          </div>

          <div
            className="flex items-center space-x-1 group"
            onClick={handleLike}
          >
            <div className="icon group-hover:bg-pink-600/10">
              <Heart
                className={`h-5 ${
                  hasLiked
                    ? "text-pink-600 fill-pink-600"
                    : "group-hover:text-pink-600"
                }`}
              />
            </div>
            {likes.length > 0 && (
              <span
                className={`text-sm ${
                  hasLiked ? "text-pink-600" : "group-hover:text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <Share2 className="h-5 group-hover:text-[#1d9bf0]" />
          </div>

          <div className="icon group">
            <BarChart2 className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
}
