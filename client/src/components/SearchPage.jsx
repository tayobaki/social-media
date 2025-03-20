import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Ellipsis,
  Heart,
  ListFilterIcon,
  ListStart,
  MessageCircle,
} from "lucide-react";
import { timeDifference } from "@/lib/utils";
import { useParams, useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const { q: searchQuery } = useParams();

  const { mutate: deletePostById, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/posts/delete/${post._id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(data?.message || "Deleted Successfully");
    },
    onError: (err) => {
      if (err?.status === 403) {
        toast.error(err?.response?.data.message);
        // NO AUTHORIZATION
      }
      if (err?.status === 404) {
        toast.error(err?.response?.data.message);
        // NO POST
      }
    },
  });

  const {
    data: sPosts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sPosts", searchQuery],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/search/${searchQuery}`);
        return res.data;
      } catch (err) {
        console.error(err.response?.data?.message || "Something went wrong");
        return []; // Return empty array on error
      }
    },
    enabled: !!searchQuery, // Only run when searchQuery has a value
  });

  console.log(sPosts);

  return (
    <div className="">
      <h1 className="px-4 pt-4 text-xl font-bold">Search Results</h1>
      <p className="px-4 text-lg">
        You searched for: <strong>{searchQuery}</strong>
      </p>

      {isLoading ? (
        <section class="dots-container mt-20">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </section>
      ) : (
        <>
          {sPosts.map((sPosts) => (
            <div
              key={sPosts._id}
              className="mt-5 border-b border-white/20 px-4 py-3 first:border-t first:border-white/20 last:border-b last:border-white/20"
            >
              <div className="relative flex items-start gap-2">
                <div className="group absolute right-0 top-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="group absolute right-0 top-0 -translate-y-[11%] cursor-pointer rounded-full p-1 hover:bg-blue-500/25">
                        <Ellipsis className="group-hover:text-white-500 flex size-5 items-center justify-center" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deletePostById(sPosts._id)}
                      >
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <img
                  src={sPosts?.image || "/avatar.png"}
                  alt={sPosts?.author?.username}
                  className="size-12 rounded-full border border-white/60 object-cover"
                />
                <div className="flex w-full flex-col">
                  <div className="flex items-end gap-2 text-sm leading-loose">
                    <h1 className="text-lg font-semibold">
                      {sPosts?.author?.username}
                    </h1>
                    <h5>@{sPosts?.author?.username}</h5>•
                    <span>{timeDifference(sPosts?.createdAt)}</span>
                  </div>
                  <p className="">{sPosts?.content}</p>
                  {sPosts?.image && (
                    <img
                      src={sPosts.image}
                      alt={sPosts?.author?.username}
                      className="mt-3 w-full rounded-lg shadow"
                    />
                  )}
                  <div className="mt-3 flex w-[70%] flex-1 items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="cursor-pointer" size={18} />
                      2.5k
                    </div>
                    <div className="flex items-center gap-2">
                      <ListStart className="cursor-pointer" size={18} />
                      1.2k
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="cursor-pointer" size={18} />
                      5.5k
                    </div>
                    <div className="flex items-center gap-2">
                      <ListFilterIcon className="cursor-pointer" size={18} />
                      78k
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
