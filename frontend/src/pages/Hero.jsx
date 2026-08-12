import { useState } from "react";
import { AiOutlinePropertySafety } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import heroImage from "../assets/hero.webp";

const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const search = (event) => { event.preventDefault(); const value = query.trim(); navigate(value ? `/auctions?q=${encodeURIComponent(value)}` : "/auctions"); };
  return <section className="overflow-hidden bg-primary"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20"><div className="max-w-xl text-white"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">Discover your next find</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Bid on items worth talking about.</h1><p className="mt-5 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">Explore trusted auctions, place bids with confidence, and sell your own special items on BidSpirit.</p><form onSubmit={search} className="mt-8"><label htmlFor="hero-search" className="sr-only">Search auctions</label><div className="flex flex-col gap-2 rounded-xl bg-white p-2 shadow-sm sm:flex-row"><div className="flex min-w-0 flex-1 items-center"><IoIosSearch aria-hidden="true" className="ml-3 shrink-0 text-slate-500" size={24} /><input id="hero-search" name="q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search auctions…" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-slate-950 placeholder:text-slate-500 focus-visible:outline-none" /></div><button type="submit" className="rounded-lg bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#204C41]">Search Auctions</button></div></form><dl className="mt-9 grid grid-cols-3 gap-3 border-t border-white/20 pt-6 sm:gap-6"><Stat value="842M" label="Products" /><Stat value="842M" label="Auctions" /><Stat value="54" label="Categories" /></dl></div><div className="relative mx-auto w-full max-w-xl"><img src={heroImage} alt="Collectors reviewing an auction item" width="800" height="600" fetchPriority="high" className="aspect-[4/3] w-full rounded-2xl object-cover" /><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:absolute lg:-bottom-7 lg:-left-7 lg:right-7 lg:grid-cols-[1.15fr_.85fr]"><TrustCard /><ClientCard /></div></div></div><div className="h-8 rounded-t-[2rem] bg-slate-50 sm:h-12" /></section>;
};

const Stat = ({ value, label }) => <div><dt className="text-xl font-bold text-white sm:text-2xl">{value}</dt><dd className="mt-1 text-xs text-slate-200 sm:text-sm">{label}</dd></div>;
Stat.propTypes = { value: PropTypes.string.isRequired, label: PropTypes.string.isRequired };
const TrustCard = () => <div className="flex min-w-0 items-center gap-3 rounded-xl bg-white p-4 text-slate-950 shadow-sm"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-primary"><AiOutlinePropertySafety aria-hidden="true" size={24} /></span><div className="min-w-0"><p className="font-bold">Safe & secure</p><p className="mt-1 text-sm text-slate-600">Bid with confidence.</p></div></div>;
const ClientCard = () => <div className="rounded-xl bg-white p-4 text-slate-950 shadow-sm"><p className="text-2xl font-bold">58M</p><p className="mt-1 text-sm font-semibold text-slate-600">Happy clients</p></div>;
export { Hero };
