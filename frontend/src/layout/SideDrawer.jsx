import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchBar from "./SearchBar";

const baseLink = "rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600";
const navLinkClass = ({ isActive }) => `${baseLink} ${isActive ? "bg-amber-50 text-amber-700" : ""}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const closeMenu = () => setOpen(false);

  const links = [
    ["/auctions", "Auctions"],
    ["/leaderboard", "Leaderboard"],
    ["/how-it-works-info", "How It Works"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ];
  if (user?.role === "Auctioneer") links.splice(2, 0, ["/create-auction", "Create Auction"], ["/view-my-auctions", "My Auctions"]);
  if (user?.role === "Bidder") links.splice(2, 0, ["/payments", "My Payments"]);
  if (user?.role === "Super Admin") links.splice(2, 0, ["/dashboard", "Dashboard"]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">
          <img src={logo} alt="BidSpirit" width="246" height="78" className="h-8 w-auto sm:h-9" fetchPriority="high" />
        </Link>
        <SearchBar />
        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={navLinkClass}>{label}</NavLink>)}
        </div>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {isAuthenticated ? <>
            <NavLink to="/me" aria-label="Open profile" className={navLinkClass}><FaUserCircle aria-hidden="true" className="text-lg" /></NavLink>
            <button type="button" onClick={() => dispatch(logout())} className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2">Log Out</button>
          </> : <>
            <Link to="/login" className={baseLink}>Log In</Link>
            <Link to="/sign-up" className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2">Create Account</Link>
          </>}
        </div>
        <button type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen((value) => !value)} className="ml-auto grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 lg:hidden">
          {open ? <IoMdClose aria-hidden="true" className="text-2xl" /> : <GiHamburgerMenu aria-hidden="true" className="text-xl" />}
        </button>
      </nav>
      {open && <div id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex flex-col gap-1">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={closeMenu} className={navLinkClass}>{label}</NavLink>)}
          {isAuthenticated ? <><NavLink to="/me" onClick={closeMenu} className={navLinkClass}>Profile</NavLink><button type="button" onClick={() => { closeMenu(); dispatch(logout()); }} className="mt-2 rounded-md bg-amber-700 px-4 py-2 text-left text-sm font-semibold text-white hover:bg-amber-800">Log Out</button></> : <><Link to="/login" onClick={closeMenu} className={baseLink}>Log In</Link><Link to="/sign-up" onClick={closeMenu} className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white">Create Account</Link></>}
        </div>
      </div>}
    </header>
  );
};

export default Navbar;
