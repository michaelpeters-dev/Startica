"use client";
import Image from "next/image";
import SidebarLink from "./SidebarLink";
import {
  Home,
  Search,
  Bell,
  Inbox,
  Bookmark,
  ClipboardList,
  User,
  MoreHorizontal,
} from "lucide-react";
import { signOut } from "next-auth/react";

const Sidebar = ({ session }) => {
  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="w-full xl:ml-24">
        <Image
          src="/plain_name.png"
          alt="Startica Wording"
          width={10}
          height={0}
          sizes="100vw"
          style={{ width: "45%", height: "auto" }}
          className="hoverAnimation mt-3"
        />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink Icon={Home} text="Home" active />
        <SidebarLink Icon={Search} text="Explore" />
        <SidebarLink Icon={Bell} text="Notifications" />
        <SidebarLink Icon={Inbox} text="Messages" />
        <SidebarLink Icon={Bookmark} text="Bookmarks" />
        <SidebarLink Icon={ClipboardList} text="Lists" />
        <SidebarLink Icon={User} text="Profile" />
        <SidebarLink Icon={MoreHorizontal} text="More" />
      </div>
      <button className="hidden xl:inline ml-auto bg-[#1E90FF] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1C7ED6]">
        Post
      </button>
      <div
        className="text-[#d9d9d9] flex items-center justify-center hoverAnimation xl:ml-auto xl:-mr-5 mt-auto"
        onClick={signOut}
      >
        <img
          src={session.user.image}
          alt="User profile image"
          className="h-10 w-10 rounded-full xl:mr-2.5"
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{session.user.name}</h4>
          <p className="text-[#6e767d]">@{session.user.tag}</p>
        </div>
        <MoreHorizontal className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
};

export default Sidebar;
