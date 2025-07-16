"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Calendar,
  BarChart2,
  Smile,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  orderBy,
  query,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { closeModal } from "@/lib/redux/features/modalSlice";
import { selectPostId } from "@/lib/redux/features/postSlice";
import Moment from "react-moment";

const Modal = ({ session }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const postId = useSelector(selectPostId);

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef(null);

  useEffect(() => {
    if (!postId) return;

    const unsubscribePost = onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot.data());
    });

    const unsubscribeComments = onSnapshot(
      query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        setCommentsList(snapshot.docs);
      }
    );

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [postId]);

  const sendComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment,
      image: selectedFile || null,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    setComment("");
    setSelectedFile(null);
    dispatch(closeModal());
    router.push(`/${postId}`);
  };

  const addEmoji = (e) => {
    const sym = e.unified.split("-");
    const codesArray = sym.map((el) => "0x" + el);
    const emoji = String.fromCodePoint(...codesArray);
    setComment(comment + emoji);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={() => dispatch(closeModal())}
        className="fixed inset-0 bg-[#A9A9A9]/20 backdrop-blur-[1px] z-40"
      />

      <div className="fixed z-50 inset-0 flex items-start justify-center pt-40">
        <div className="w-full max-w-2xl bg-black text-white rounded-3xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button
              onClick={() => dispatch(closeModal())}
              className="hover:bg-gray-800 rounded-full p-2 transition"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="px-5 pt-4 pb-6">
            {post && (
              <div className="flex gap-x-3 text-[#6e767d] relative">
                <div className="w-11 flex justify-center relative">
                  <img
                    src={post?.userImg}
                    alt="User"
                    className="h-11 w-11 rounded-full z-10"
                  />
                  {commentsList.length > 0 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-px bg-gray-600"
                      style={{ top: "2.75rem", bottom: "-1.5rem" }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-x-1 text-[16px]">
                    <span className="text-white font-bold text-[16px]">
                      {post?.username}
                    </span>
                    <span>@{post?.tag}</span>
                    <span>·</span>
                    <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                  </div>
                  <p className="text-white text-[16px] mt-1 leading-snug">
                    {post?.text}
                  </p>
                  {post?.image && (
                    <img
                      src={post.image}
                      alt="Attached"
                      className="rounded-2xl mt-2 max-h-80 object-cover"
                    />
                  )}
                </div>
              </div>
            )}

            {commentsList.length > 0 && (
              <div className="pt-6 space-y-6">
                {commentsList.map((doc, idx) => {
                  const c = doc.data();
                  return (
                    <div
                      key={doc.id}
                      className="flex items-start space-x-3 relative"
                    >
                      <div className="w-11 flex justify-center relative">
                        <img
                          src={c.userImg}
                          alt="pfp"
                          className="h-10 w-10 rounded-full z-10"
                        />
                        {idx < commentsList.length - 1 && (
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-[calc(100%+1.5rem)] bg-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 text-[16px] text-[#6e767d]">
                        <div className="flex items-center gap-x-1">
                          <span className="text-white font-bold text-[16px]">
                            {c.username}
                          </span>
                          <span>@{c.tag}</span>
                          <span>·</span>
                          <Moment fromNow>{c.timestamp?.toDate()}</Moment>
                        </div>
                        <p className="text-white text-[16px] leading-snug">
                          {c.comment}
                        </p>
                        {c.image && (
                          <img
                            src={c.image}
                            alt="Attached comment"
                            className="rounded-2xl mt-2 max-h-80 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex gap-x-3 border-t border-gray-700 pt-4 sticky bottom-0 bg-black">
              <img
                src={session.user.image}
                alt="Profile"
                className="h-11 w-11 rounded-full"
              />
              <div className="flex-1">
                {selectedFile && (
                  <div className="relative mb-2">
                    <img
                      src={selectedFile}
                      alt="Upload preview"
                      className="rounded-2xl max-h-80 object-contain"
                    />
                  </div>
                )}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Post your reply?"
                  rows="2"
                  className="w-full bg-transparent text-white text-[16px] placeholder-gray-500 outline-none resize-none leading-snug"
                />
                <div className="flex items-center justify-between pt-3">
                  <div className="flex gap-x-4 items-center">
                    <ImageIcon
                      className="h-5 text-[#1d9bf0] cursor-pointer"
                      onClick={() => filePickerRef.current.click()}
                    />
                    <input
                      type="file"
                      hidden
                      ref={filePickerRef}
                      onChange={addImageToPost}
                    />
                    <BarChart2 className="h-5 text-[#1d9bf0] rotate-90 cursor-pointer" />
                    <Smile
                      className="h-5 text-[#1d9bf0] cursor-pointer"
                      onClick={() => setShowEmojis(!showEmojis)}
                    />
                    <Calendar className="h-5 text-[#1d9bf0] cursor-pointer" />
                  </div>
                  <button
                    disabled={!comment.trim()}
                    onClick={sendComment}
                    className="bg-[#1d9bf0] text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:bg-[#1a8cd8] disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
                {showEmojis && (
                  <div className="fixed ml-[80px] z-[9999]">
                    <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default Modal;
