"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { openModal } from "@/lib/redux/features/modalSlice";
import { setPostId } from "@/lib/redux/features/postSlice";
import Moment from "react-moment";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import { db } from "../../firebase";
import {
  MessageCircle,
  Trash2,
  Repeat,
  Share2,
  BarChart2,
  MoreHorizontal,
  Heart,
} from "lucide-react";

const Post = ({ id, post, postPage, session }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [id]);

  useEffect(() => {
    return onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
      setLikes(snapshot.docs)
    );
  }, [db, id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
  }, [likes]);

  const likePost = async () => {
    if (!session?.user?.uid) return;

    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={() => router.push(`/${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt="Profile Picture"
          className="h-11 w-11 rounded-full mr-4"
        />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt="Profile Picture"
              className="h-11 w-11 rounded-full mr-4"
            />
          )}
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !postPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
              >
                @{post?.tag}
              </span>
            </div>{" "}
            .{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.text}
              </p>
            )}
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <MoreHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        {postPage && (
          <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
            {post?.text}
          </p>
        )}
        {post?.image && (
          <div className="w-full flex justify-center items-center">
            <div className="w-[100%] max-w-[400px]">
              <img
                src={post.image}
                alt="Post image"
                className="rounded-2xl object-contain w-full h-auto mx-auto"
              />
            </div>
          </div>
        )}

        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setPostId(id));
              dispatch(openModal());
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <MessageCircle className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {session.user.uid === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <Trash2 className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <Repeat className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              <Heart
                className={`h-5 ${
                  liked ? "text-pink-600" : "group-hover:text-pink-600"
                }`}
                fill={liked ? "#db2777" : "none"}
              />
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
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
};

export default Post;
