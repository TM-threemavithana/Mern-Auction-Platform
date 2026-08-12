import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim().toLowerCase();
  const matchingAuctions = query ? allAuctions.filter((auction) => [auction.title, auction.category, auction.description].some((value) => value?.toLowerCase().includes(query))) : allAuctions;
  if (loading) return <Spinner />;
  return <main className="mx-auto min-h-[calc(100vh-16rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14"><Link to="/" className="inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">← Back to home</Link><header className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Browse listings</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Auctions</h1><p className="mt-2 text-slate-600">Discover active and upcoming items available for bidding.</p></div>{query && <Link to="/auctions" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">Clear Search</Link>}</header>{matchingAuctions.length ? <div className="mt-8 flex flex-wrap gap-6">{matchingAuctions.map((auction) => <Card key={auction._id} title={auction.title} startTime={auction.startTime} endTime={auction.endTime} imgSrc={auction.image?.url} startingBid={auction.startingBid} id={auction._id} />)}</div> : <EmptyAuctionState query={rawQuery.trim()} />}</main>;
};

const EmptyAuctionState = ({ query }) => <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center sm:px-10"><h2 className="text-xl font-bold text-slate-950">{query ? "No matching auctions" : "No auctions available yet"}</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">{query ? `No auction matches “${query}”. Try a different keyword or browse every listing.` : "New listings will appear here once auctioneers publish them. You can return home while you wait."}</p><div className="mt-6 flex flex-wrap justify-center gap-3">{query && <Link to="/auctions" className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2">Clear Search</Link>}<Link to="/" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-300 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">Back to Home</Link></div></section>;
EmptyAuctionState.propTypes = { query: PropTypes.string.isRequired };
export default Auctions;
