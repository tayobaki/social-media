import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "./CreatePost";
import Post from "./Post";

export function TabsDisplay({ user }) {
  const [active, setActive] = useState("for-you");

  const { data: posts } = useQuery({
    queryKey: ["posts"],
  });

  return (
    <Tabs defaultValue="for-you" className="">
      <TabsList className="sticky top-0 z-50 grid h-16 grid-cols-2 bg-white/5 backdrop-blur-2xl backdrop-brightness-50">
        <TabsTrigger onClick={() => setActive("for-you")} value="for-you">
          <h1
            className={cn(
              active === "for-you" &&
                "before:absolute before:bottom-0 before:h-1 before:w-full before:rounded-full before:bg-blue-400",
              "relative flex h-full items-center justify-center",
            )}
          >
            For you
          </h1>
        </TabsTrigger>
        <TabsTrigger onClick={() => setActive("following")} value="following">
          <h1
            className={cn(
              active === "following" &&
                "before:absolute before:bottom-0 before:h-1 before:w-full before:rounded-full before:bg-blue-400",
              "relative flex h-full items-center justify-center",
            )}
          >
            Following
          </h1>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="for-you">
        <CreatePost user={user} />
        <div className="mt-2">
          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
          {posts?.length === 0 && (
            <div className="p-4 text-center text-3xl font-semibold">
              No Posts Yet
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="following">{/* <Following /> */}</TabsContent>
    </Tabs>
  );
}
