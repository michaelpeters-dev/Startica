import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import Login from "@/components/Login";
import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Modal from "@/components/Modal";

export default async function Home() {
  const [trendingRes, followRes] = await Promise.all([
    fetch("https://www.jsonkeeper.com/b/NKEV", { cache: "no-store" }),
    fetch("https://www.jsonkeeper.com/b/WWMJ", { cache: "no-store" }),
  ]);
  const trendingResults = await trendingRes.json();
  const followResults = await followRes.json();

  const providers = await getProviders();
  const session = await getServerSession(authOptions);
  if (!session) {
    return <Login providers={providers} />;
  }

  return (
    <div className="bg-black">
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar session={session} />
        <Feed
          trendingResults={trendingResults}
          followResults={followResults}
          providers={providers}
          session={session}
        />
        <Modal session={session} />
      </main>
    </div>
  );
}
