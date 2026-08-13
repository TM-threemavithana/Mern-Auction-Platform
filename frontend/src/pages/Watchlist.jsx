import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import api, { getErrorMessage } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Watchlist = () => {
  const [auctions, setAuctions] = useState([]); const [loading, setLoading] = useState(true);
  const load = async () => { try { const { data } = await api.get("/tools/watchlist"); setAuctions(data.auctions); } catch (error) { toast.error(getErrorMessage(error)); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const remove = async (id) => { try { await api.delete(`/tools/watchlist/${id}`); setAuctions((items) => items.filter((item) => item._id !== id)); toast.success("Removed from saved lots."); } catch (error) { toast.error(getErrorMessage(error)); } };
  if (loading) return <Spinner />;
  return <main className="mx-auto min-h-[calc(100vh-14rem)] max-w-7xl px-4 py-10 sm:px-6"><p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Buyer workspace</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Saved lots</h1><p className="mt-2 text-slate-600">Keep an eye on lots you may want to register for.</p>{auctions.length ? <div className="mt-7 flex flex-wrap gap-6">{auctions.map((auction) => <div key={auction._id} className="relative"><Card title={auction.title} startTime={auction.startTime} endTime={auction.endTime} imgSrc={auction.image?.url} startingBid={auction.startingBid} id={auction._id}/><button onClick={() => remove(auction._id)} className="mt-2 text-sm font-semibold text-amber-700 hover:text-amber-800">Remove saved lot</button></div>)}</div> : <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">You have not saved any lots yet.</div>}</main>;
};
export default Watchlist;
