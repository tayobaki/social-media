import React from "react";
import SearchBar from "./search-bar.jsx";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import avatar from "/avatar.png";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.js";

export default function SideBar() {
  return (
    <aside className="w-full max-w-0 flex-1 md:max-w-[100px] lg:max-w-[390px]">
      <div className="mx-5 hidden lg:block">
        <SearchBar />
        <Suspense
          fallback={
            <Loader2 color="#3B82F6" className="mx-auto mt-4 animate-spin" />
          }
        >
          <WhoToFollow />
        </Suspense>
      </div>
    </aside>
  );
}

function WhoToFollow() {
  // const user = await validateUser();
  // if (!user) return null;

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  if (!recommendedUsers) return null;

  return (
    <div className="min-h-[110vh]">
      <div className="mt-4 rounded-lg border border-white/20 p-4">
        <h1 className="mb-2 text-lg font-semibold">Who to follow</h1>

        <div className="space-y-2">
          {recommendedUsers.map((recommendedUser) => (
            <div
              key={recommendedUser._id}
              className="flex items-start justify-start gap-2 text-sm"
            >
              <img
                src={recommendedUser?.profilePicture || avatar}
                width={55}
                height={55}
                alt={recommendedUser?.username}
                className="size-[55px] rounded-full object-cover"
              />
              <div className="">
                <h1 className="line-clamp-1 text-lg font-semibold">
                  {recommendedUser?.username}
                </h1>
                <h1 className="line-clamp-1 text-muted-foreground">
                  @{recommendedUser?.username}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
