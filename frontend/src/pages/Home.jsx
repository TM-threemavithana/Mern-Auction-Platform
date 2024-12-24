import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "@/custom-components/Spinner";
import { FaHammer, FaGavel, FaRegEnvelope, FaDollarSign } from "react-icons/fa";

const Home = () => {
  const howItWorks = [
    { title: "Post Items", description: "Auctioneer posts items for bidding.", icon: <FaHammer /> },
    { title: "Place Bids", description: "Bidders place bids on listed items.", icon: <FaGavel /> },
    { title: "Win Notification", description: "Highest bidder receives a winning email.", icon: <FaRegEnvelope /> },
    { title: "Payment & Fees", description: "Bidder pays; auctioneer pays 5% fee.", icon: <FaDollarSign /> },
  ];

  const { isAuthenticated } = useSelector((state) => state.user);
  
  return (
    <section className="w-full h-auto pt-20 lg:pl-5 flex flex-col justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-10">
        <p className="text-[#DECCBE] font-bold text-xl mb-8">
          Transparency Leads to Your Victory
        </p>
        <h1 className="text-[#111] text-4xl font-bold mb-2 md:text-5xl lg:text-6xl xl:text-7xl">
          Transparent Auctions
        </h1>
        <h1 className="text-[#d6482b] text-4xl font-bold mb-4 md:text-5xl lg:text-6xl xl:text-7xl">
          Be The Winner
        </h1>
        <div className="flex flex-col md:flex-row justify-center gap-4 my-8">
          {!isAuthenticated && (
            <>
              <Link
                to="/sign-up"
                className="bg-[#d6482b] font-semibold hover:bg-[#b8381e] rounded-md px-8 py-2 text-white transition-all duration-300 shadow-lg"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-[#DECCBE] bg-transparent border-2 border-[#DECCBE] hover:bg-[#fff3fd] hover:text-[#fdba88] font-bold text-xl rounded-md px-8 py-2 transition-all duration-300 shadow-md"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-10">
        <h3 className="text-[#111] text-xl font-semibold mb-2 md:text-2xl lg:text-3xl text-center">How it Works</h3>
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap justify-center">
          {howItWorks.map((element) => (
            <div
              key={element.title}
              className="bg-white flex flex-col gap-2 p-4 rounded-md h-fit justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl text-[#d6482b]">{element.icon}</div>
                <h5 className="font-bold">{element.title}</h5>
              </div>
              <p className="text-gray-600">{element.description}</p>
            </div>
          ))}
        </div>
      </div>
      <FeaturedAuctions />
      <UpcomingAuctions />
      <Leaderboard />
    </section>
  );
};

export default Home;