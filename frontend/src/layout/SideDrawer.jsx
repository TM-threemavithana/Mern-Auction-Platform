import React, { useState, useEffect } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUserCircle, FaFileInvoiceDollar, FaEye } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link } from "react-router-dom";
import Img1 from "../assets/logo.png";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all ${scrolled ? "bg-white shadow-lg" : "bg-[#5A8A80]"}`}>
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img src={Img1} alt="Bid Spirit" className="h-10" />
        </Link>
        <SearchBar />
        <div className="lg:flex hidden space-x-6 items-center">
          <NavLink to="/auctions">Auctions</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          {isAuthenticated && user.role === "Auctioneer" && (
            <>
              <NavLink to="/submit-commission">
                 Submit Commission
              </NavLink>
              <NavLink to="/create-auction">
                 Create Auction
              </NavLink>
              <NavLink to="/view-my-auctions">
                 View My Auctions
              </NavLink>
            </>
          )}
          <NavLink to="/how-it-works-info">How it works</NavLink>
          <NavLink to="/about">About Us</NavLink>
        </div>
        <div className="flex space-x-4">
          {isAuthenticated && user.role === "Super Admin" && (
            <NavLink to="/dashboard">
              <MdDashboard className="mr-2" /> Dashboard
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/me">
              <FaUserCircle className="mr-2" /> Profile
            </NavLink>
          )}
        </div>
        <div className="lg:hidden text-3xl text-[#D6482B]" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/sign-up" className="bg-[#D6482B] text-white px-4 py-2 rounded-md hover:bg-[#b8381e]">
                Sign Up
              </Link>
              <Link to="/login" className="border border-[#DECCBE] text-[#DECCBE] px-4 py-2 rounded-md hover:bg-[#fffefd] hover:text-[#fdba88]">
                Login
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="bg-[#D6482B] text-white px-4 py-2 rounded-md hover:bg-[#b8381e]">
              Logout
            </button>
          )}
        </div>
      </div>
      {show && (
        <div className="lg:hidden bg-[#f6f4f0] p-4 border-t border-gray-300">
          <IoMdCloseCircleOutline onClick={() => setShow(false)} className="text-2xl text-[#D6482B] cursor-pointer mb-4" />
          <ul className="space-y-3">
            <MobileNavLink to="/auctions">AUCTIONS</MobileNavLink>
            <MobileNavLink to="/leaderboard">LEADERBOARD</MobileNavLink>
            {isAuthenticated && user.role === "Auctioneer" && (
              <>
                <MobileNavLink to="/submit-commission">
                  <FaFileInvoiceDollar /> Submit Commission
                </MobileNavLink>
                <MobileNavLink to="/create-auction">
                  <IoIosCreate /> Create Auction
                </MobileNavLink>
                <MobileNavLink to="/view-my-auctions">
                  <FaEye /> View My Auctions
                </MobileNavLink>
              </>
            )}
            {isAuthenticated && user.role === "Super Admin" && (
              <MobileNavLink to="/dashboard">
                <MdDashboard /> Dashboard
              </MobileNavLink>
            )}
            <MobileNavLink to="/how-it-works-info">HOW IT WORKS</MobileNavLink>
            <MobileNavLink to="/about">ABOUT US</MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink to="/me">PROFILE</MobileNavLink>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="text-xl font-semibold hover:text-[#D6482b] transition-colors">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-xl font-semibold hover:text-[#D6482b] transition-colors">
      {children}
    </Link>
  </li>
);

export default Navbar;