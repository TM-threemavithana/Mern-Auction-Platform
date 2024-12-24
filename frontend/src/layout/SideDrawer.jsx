import React, { useState } from "react";
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
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-[#4c9224] border-b border-gray-300 shadow-lg">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img src={Img1} alt="Bid Spirit" className="h-10" />
        </Link>
        <SearchBar />
        <div className="lg:flex hidden space-x-6 items-center">
          <Link
            to="/auctions"
            className="text-xl font-semibold hover:text-[#D6482b]"
          >
            Auctions
          </Link>
          <Link
            to="/leaderboard"
            className="text-xl font-semibold hover:text-[#D6482b]"
          >
            Leaderboard
          </Link>
          {isAuthenticated && user.role === "Auctioneer" && (
            <>
              <Link
                to="/submit-commission"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                <FaFileInvoiceDollar /> Submit Commission
              </Link>
              <Link
                to="/create-auction"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                <IoIosCreate /> Create Auction
              </Link>
              <Link
                to="/view-my-auctions"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                <FaEye /> View My Auctions
              </Link>
            </>
          )}

          <Link
            to="/how-it-works-info"
            className="text-xl font-semibold hover:text-[#D6482b]"
          >
            How it works
          </Link>
          <Link
            to="/about"
            className="text-xl font-semibold hover:text-[#D6482b]"
          >
            About Us
          </Link>
        </div>
        <div className="flex space-x-4"> {/* Flex container for links */}
        {isAuthenticated && user.role === "Super Admin" && (
          <Link
            to="/dashboard"
            className="flex items-center text-xl font-semibold hover:text-[#D6482b]" // Added 'flex items-center' here
          >
            <MdDashboard className="mr-2" /> Dashboard {/* Margin to the right of the icon */}
          </Link>
        )}
        {isAuthenticated && (
          <Link
            to="/me"
            className="flex items-center text-xl font-semibold hover:text-[#D6482b]" // Added 'flex items-center' here
          >
            <FaUserCircle className="mr-2" /> Profile {/* Margin to the right of the icon */}
          </Link>
        )}
      </div>
         

        <div
          className="lg:hidden text-3xl text-[#D6482B]"
          onClick={() => setShow(!show)}
        >
          <GiHamburgerMenu />
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/sign-up"
                className="bg-[#D6482B] text-white px-4 py-2 rounded-md hover:bg-[#b8381e]"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="border border-[#DECCBE] text-[#DECCBE] px-4 py-2 rounded-md hover:bg-[#fffefd] hover:text-[#fdba88]"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-[#D6482B] text-white px-4 py-2 rounded-md hover:bg-[#b8381e]"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {show && (
        <div className="lg:hidden bg-[#f6f4f0] p-4 border-t border-gray-300">
          <IoMdCloseCircleOutline
            onClick={() => setShow(false)}
            className="text-2xl text-[#D6482B] cursor-pointer mb-4"
          />
          <ul className="space-y-3">
            <li>
              <Link
                to="/auctions"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                AUCTIONS
              </Link>
            </li>
            <li>
              <Link
                to="/leaderboard"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                LEADERBOARD
              </Link>
            </li>
            {isAuthenticated && user.role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to="/submit-commission"
                    className="text-xl font-semibold hover:text-[#D6482b]"
                  >
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-auction"
                    className="text-xl font-semibold hover:text-[#D6482b]"
                  >
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link
                    to="/view-my-auctions"
                    className="text-xl font-semibold hover:text-[#D6482b]"
                  >
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && user.role === "Super Admin" && (
              <li>
                <Link
                  to="/dashboard"
                  className="text-xl font-semibold hover:text-[#D6482b]"
                >
                  <MdDashboard /> Dashboard
                </Link>
              </li>
            )}
            
            <li>
              <Link
                to="/how-it-works-info"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                HOW IT WORKS
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-xl font-semibold hover:text-[#D6482b]"
              >
                ABOUT US
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/me"
                  className="text-xl font-semibold hover:text-[#D6482b]"
                > PROFILE
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
