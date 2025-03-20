import { timeDifference } from "@/lib/utils";
import {
  Ellipsis,
  Heart,
  ListFilterIcon,
  ListStart,
  MessageCircle,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Post({ post }) {
  const { postId } = useParams();
  const queryClient = useQueryClient();
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

  return (
    <div className="border-b border-white/20 px-4 py-3 first:border-t first:border-white/20 last:border-b last:border-white/20">
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
              <DropdownMenuItem onClick={() => deletePostById(post._id)}>
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <img
          src={post?.author?.profilePicture || "/avatar.png"}
          alt={post?.author?.username}
          className="size-12 rounded-full border border-white/60 object-cover"
        />
        <div className="flex w-full flex-col">
          <div className="flex items-end gap-2 text-sm leading-loose">
            <h1 className="text-lg font-semibold">{post?.author?.username}</h1>
            <h5>@{post?.author?.username}</h5>•
            <span>{timeDifference(post.createdAt)}</span>
          </div>
          <p className="">{post?.content}</p>
          {post?.image && (
            <img
              src={post.image}
              alt={post?.author?.username}
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
  );
}
