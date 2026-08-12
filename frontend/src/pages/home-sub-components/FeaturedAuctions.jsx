import Card from "@/custom-components/Card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const FeaturedAuctions = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const auctions = allAuctions.slice(0, 8);
  return <section aria-labelledby="featured-auctions"><header className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Explore</p><h2 id="featured-auctions" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Featured Auctions</h2></div><Link to="/auctions" className="text-sm font-semibold text-amber-700 hover:text-amber-800">View all auctions</Link></header>{auctions.length ? <div className="mt-6 flex flex-wrap gap-6">{auctions.map((auction) => <Card key={auction._id} title={auction.title} imgSrc={auction.image?.url} startTime={auction.startTime} endTime={auction.endTime} startingBid={auction.startingBid} id={auction._id} />)}</div> : <EmptyState title="No featured auctions yet" detail="New listings will appear here as soon as auctioneers publish them." action="Browse all auctions" />}</section>;
};
const EmptyState = ({ title, detail, action }) => <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><h3 className="text-lg font-semibold text-slate-900">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{detail}</p><Link to="/auctions" className="mt-5 inline-flex rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">{action}</Link></div>;
EmptyState.propTypes = { title: PropTypes.string.isRequired, detail: PropTypes.string.isRequired, action: PropTypes.string.isRequired };
export default FeaturedAuctions;
