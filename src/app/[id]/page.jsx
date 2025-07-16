import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostPage from "@/components/PostPage";

export default async function Page({ params }) {
  const awaitedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="text-white p-10">Please sign in to view post.</div>;
  }

  const [trendingRes, followRes] = await Promise.all([
    fetch("https://www.jsonkeeper.com/b/0OM6", { cache: "no-store" }),
    fetch("https://www.jsonkeeper.com/b/TBZX", { cache: "no-store" }),
  ]);

  const trendingResults = await trendingRes.json();
  const followResults = await followRes.json();

  return (
    <PostPage
      id={awaitedParams.id}
      session={session}
      trendingResults={trendingResults}
      followResults={followResults}
    />
  );
}
