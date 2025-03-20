import { CircleEllipsis, LogOut, Send } from "lucide-react";
import { sidebarIcons } from "../../../assets.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { axiosInstance } from "@/lib/axios.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.js";

export default function Nav({ user }) {
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => axiosInstance.post("/auth/logout"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {},
  });

  return (
    <aside className="sticky left-0 top-0 hidden min-h-screen w-[50px] flex-col items-center justify-center gap-1 px-4 py-4 sm:flex md:w-[100px] lg:w-[150px] lg:items-end lg:justify-end">
      <>
        <div className="mb-auto flex flex-col gap-1">
          {sidebarIcons.map((icons, id) => {
            const linkDestination =
              icons.link === "/profile"
                ? `/profile/${user?.username}`
                : icons.link;
            return (
              <div key={id}>
                <Link
                  className={cn(icons.link === "/e" && "cursor-not-allowed")}
                  to={linkDestination}
                >
                  {icons.icon}
                </Link>
                {/* <Link to={`/profile/${user?.username}`}>Profile</Link> */}
                {/* <Link to={`/${user?.username}`}>Profile</Link> */}
              </div>
            );
          })}
          <div className="rounded-full p-3 duration-300 hover:bg-white/15">
            <CircleEllipsis color="#E7E9EA" className="size-7" />
          </div>
          <div className="rounded-full p-3 duration-300 hover:bg-white/15">
            <Send color="#E7E9EA" className="size-7" />
          </div>
        </div>

        <div className="">
          <div className="flex w-full flex-1 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-none border-none">
                <Avatar className="size-10 cursor-pointer object-cover">
                  <AvatarImage
                    src={user?.profilePicture}
                    className="size-12 rounded-full object-cover"
                  />
                  <AvatarFallback>{user?.username[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </>
    </aside>
  );
}

export function SmallNav() {
  // const user = await validateUser();

  return (
    <aside className="fixed bottom-0 left-0 z-50 flex w-full flex-1 border-t border-white/20 bg-white/5 px-2 py-2 backdrop-blur-2xl backdrop-brightness-50 sm:hidden">
      <>
        <div className="grid w-full grid-cols-6">
          {sidebarIcons.map((icons, id) => (
            <div className="w-full" key={id}>
              <div className="m-1 flex items-center justify-center text-center">
                {icons.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden"></div>
      </>
    </aside>
  );
}
