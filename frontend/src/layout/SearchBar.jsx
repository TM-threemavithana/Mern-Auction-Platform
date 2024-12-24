import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      console.log("Search Query:", searchQuery);
      // Add search logic here
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search auctions..."
        className="bg-gray-100 text-gray-600 pl-4 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D6482B] transition-all"
      />
      <button type="submit" className="absolute right-2 top-2 text-gray-600 hover:text-[#D6482B]">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
