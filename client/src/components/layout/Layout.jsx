import React from "react";
import SideBar from "../Sidebar";

import { useQuery } from "@tanstack/react-query";
import Nav, { SmallNav } from "./Nav";

function Layout({ children }) {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-start">
        <Nav user={authUser} />
        <SmallNav />
        <div className="min-h-[100vh] flex-1 flex-wrap border-x border-white/20">
          <main>{children}</main>
        </div>
        <SideBar />
      </div>
    </div>
  );
}

export default Layout;
