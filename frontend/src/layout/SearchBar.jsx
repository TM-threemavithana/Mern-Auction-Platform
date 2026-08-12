import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = () => {
  const [params] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get("q") || "");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/auctions?q=${encodeURIComponent(query)}` : "/auctions");
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden min-w-0 flex-1 max-w-md md:block">
      <label htmlFor="auction-search" className="sr-only">Search auctions</label>
      <input
        id="auction-search"
        name="q"
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search auctions…"
        className="w-full rounded-full border border-slate-300 bg-white py-2 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
      />
      <button type="submit" aria-label="Search auctions" className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">
        <FaSearch aria-hidden="true" />
      </button>
    </form>
  );
};

export default SearchBar;
