import {
  SearchIcon,
  Bookmark,
  Mail,
  Users,
  Home,
  Bell,
  User,
  CircleEllipsis,
  RotateCw,
  Send,
} from "lucide-react";

export const sidebarIcons = [
  {
    icon: (
      <div className="rounded-full p-3 duration-300 hover:bg-white/15">
        <Home color="#E7E9EA" className="size-7" />
      </div>
    ),
    link: "/",
  },
  {
    icon: (
      <div className="rounded-full p-3 duration-300 hover:bg-white/15">
        <SearchIcon color="#E7E9EA" className="size-7" />
      </div>
    ),
    link: "/",
  },
  {
    icon: (
      <div className="rounded-full p-3 duration-300 hover:bg-white/15">
        <Bell color="#E7E9EA" className="size-7" />
      </div>
    ),
    link: "/",
  },
  {
    icon: (
      <div className="rounded-full p-3 duration-300 hover:bg-white/15">
        <Mail color="#E7E9EA" className="size-7" />
      </div>
    ),
    link: "/",
  },
  {
    icon: (
      <div className="rounded-full p-3 duration-300 hover:bg-white/15">
        <Users color="#E7E9EA" className="size-7" />
      </div>
    ),
    link: "/",
  },
  {
    icon: (
      <div className="rounded-full p-3 duration-300 hover:bg-white/15">
        <User color="#E7E9EA" className="size-7" />
      </div>
    ),
    link: "/profile",
  },
  // You can add more icons here if needed
];
