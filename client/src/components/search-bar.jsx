import { useState } from "react";
import { Search } from "lucide-react";
import { Form, useNavigate } from "react-router-dom";

export default function SearchForm() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const q = e.currentTarget.q.value.trim();

    if (!q) return;
    navigate(`/search/${q}`);
    setQuery("");
  }

  return (
    <div className="sticky top-0 z-50 flex h-12 items-end bg-black font-mono">
      <form
        onSubmit={handleSubmit}
        className="relative w-full rounded-full bg-[#202327] px-1 py-2 text-[#E7E9EA]"
      >
        <input
          name="q"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex h-6 w-full flex-1 rounded-md bg-transparent px-1 py-0.5 pl-5 text-sm outline-none placeholder:text-[#71767b] placeholder:text-muted-foreground focus:border-none"
        />
      </form>
    </div>
  );
}
