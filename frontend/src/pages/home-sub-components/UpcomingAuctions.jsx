import { RiAuctionFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UpcomingAuctions = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const today = new Date().toDateString();
  const items = allAuctions.filter((auction) => new Date(auction.startTime).toDateString() === today).slice(0, 6);
  return <section aria-labelledby="today-auctions"><div className="grid gap-5 lg:grid-cols-[280px_1fr]"><div className="flex min-h-56 flex-col justify-between rounded-xl bg-slate-950 p-6 text-white"><span className="grid h-11 w-11 place-items-center rounded-full bg-amber-200 text-slate-950"><RiAuctionFill aria-hidden="true" /></span><div><p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Today</p><h2 id="today-auctions" className="mt-2 text-3xl font-bold">Auctions starting today</h2></div></div>{items.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((auction) => <AuctionPreview key={auction._id} auction={auction} />)}</div> : <div className="flex min-h-56 items-center rounded-xl border border-dashed border-slate-300 bg-white p-6"><div><h3 className="text-lg font-semibold text-slate-900">Nothing starts today</h3><p className="mt-2 text-sm text-slate-600">Check the full auction list to see upcoming listings.</p><Link to="/auctions" className="mt-4 inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800">Browse auctions</Link></div></div>}</div></section>;
};
const AuctionPreview = ({ auction }) => <Link to={`/auction/item/${auction._id}`} className="group flex min-w-0 gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:border-amber-300 hover:bg-amber-50"><img src={auction.image?.url} alt={auction.title} width="72" height="72" loading="lazy" className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-lg object-cover" /><div className="min-w-0"><h3 className="truncate font-semibold text-slate-900 group-hover:text-amber-800">{auction.title}</h3><p className="mt-1 text-sm text-slate-600">Starts {new Intl.DateTimeFormat(undefined, { hour:"numeric", minute:"2-digit" }).format(new Date(auction.startTime))}</p><p className="mt-2 text-sm font-semibold text-amber-700">Starting bid: {auction.startingBid}</p></div></Link>;
AuctionPreview.propTypes = { auction: PropTypes.shape({ _id: PropTypes.string.isRequired, image: PropTypes.shape({ url: PropTypes.string }), title: PropTypes.string, startTime: PropTypes.string, startingBid: PropTypes.number }).isRequired };
export default UpcomingAuctions;
