"use client";

import { useRef, useState } from "react";
import {
  Calendar,
  BarChart2,
  Smile,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/../firebase";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function Input({ session }) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const filePickerRef = useRef(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const post = {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.email.split("@")[0],
      text: input,
      image: selectedFile || null,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "posts"), post);
      console.log("Posted");
    } catch (e) {
      console.error("Post failed", e);
    }

    setTimeout(() => {
      setInput("");
      setSelectedFile(null);
      setShowEmojis(false);
      setLoading(false);
    }, 400);
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

  const addEmoji = (e) => {
    const sym = e.unified.split("-");
    const codesArray = sym.map((el) => "0x" + el);
    const emoji = String.fromCodePoint(...codesArray);
    setInput((prev) => prev + emoji);
  };

  return (
    <div className="border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll">
      <img
        src={session.user.image}
        alt="Profile"
        className="h-11 w-11 rounded-full"
      />
      <div className="w-full divide-y divide-gray-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="2"
            placeholder="New insight?"
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          />

          {selectedFile && (
            <div className="relative mt-2">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => setSelectedFile(null)}
              >
                <X className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt="Selected"
                className="rounded-2xl max-h-80 object-contain mx-auto"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5">
          <div className="flex items-center gap-x-2">
            <div className="icon" onClick={() => filePickerRef.current.click()}>
              <ImageIcon className="h-[22px] text-[#1E90FF]" />
              <input
                type="file"
                hidden
                ref={filePickerRef}
                onChange={addImageToPost}
              />
            </div>

            <div className="relative">
              <div
                className="icon cursor-pointer"
                onClick={() => setShowEmojis((prev) => !prev)}
              >
                <Smile className="h-[22px] text-[#1E90FF]" />
              </div>

              {showEmojis && (
                <div className="fixed z-[9999]">
                  <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
                </div>
              )}
            </div>

            <div className="icon">
              <Calendar className="h-[22px] text-[#1E90FF]" />
            </div>

            <div className="icon">
              <BarChart2 className="h-[22px] text-[#1E90FF]" />
            </div>
          </div>

          <button
            className="bg-[#1E90FF] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1C7ED6] disabled:opacity-50 disabled:cursor-default"
            disabled={!input.trim() && !selectedFile}
            onClick={sendPost}
          >
            {loading ? "Posting..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
