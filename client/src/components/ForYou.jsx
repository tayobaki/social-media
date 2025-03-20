import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
// import PostEditor from "./posts/post-editor";
// import Post from "./posts/post";
import { Loader2 } from "lucide-react";

export default function ForYou() {
  const { isPending, data, isError, error } = useQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await axios.post(`/api/posts/for-you`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      return res.json();
    },
    staleTime: 3000,
    refetchOnMount: true,
  });

  return (
    <div className="">
      {/* <PostEditor /> */}
      <div className="mt-3">
        {/* {isError ? (
          <p>Error loading posts: {error.message}</p>
        ) : isPending ? (
          <Loader2 color="#3B82F6" className="mx-auto w-full animate-spin" />
        ) : data.length > 0 ? (
          data?.map((post) => <Post key={post?.id} post={post} />)
        ) : (
          <div className="text-center text-3xl font-bold">Create New Post</div>
        )} */}
      </div>
    </div>
  );
}
