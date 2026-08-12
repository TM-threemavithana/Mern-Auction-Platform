import { useEffect, useId, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import { deleteAuction, republishAuction } from "@/store/slices/auctionSlice";

const CardTwo = ({ imgSrc, title, startingBid, endTime, id }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();
  const ended = new Date(endTime) <= new Date();
  const confirmDelete = () => { if (window.confirm(`Delete “${title}”? This cannot be undone.`)) dispatch(deleteAuction(id)); };
  return <div className="min-w-0 basis-full rounded-lg bg-white sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] xl:basis-[calc(25%-1.125rem)]">
    <img src={imgSrc} alt={title} width="400" height="300" loading="lazy" className="aspect-[4/3] w-full object-contain p-4" />
    <div className="min-w-0 px-3 pb-4"><h2 className="truncate text-lg font-semibold">{title}</h2><p className="mt-2 text-sm text-stone-600">Starting bid <span className="font-bold text-amber-700">${Number(startingBid || 0).toFixed(2)}</span></p>
      <div className="mt-4 grid gap-2"><Link className="rounded-md bg-primary px-4 py-2 text-center font-semibold text-white hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600" to={`/auction/details/${id}`}>View Auction</Link><button type="button" className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600" onClick={confirmDelete}>Delete Auction</button><button type="button" disabled={!ended} onClick={() => setOpenDrawer(true)} className="rounded-md bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">Republish Auction</button></div>
    </div><RepublishDialog id={id} open={openDrawer} onClose={() => setOpenDrawer(false)} />
  </div>;
};

const RepublishDialog = ({ id, open, onClose }) => {
  const dispatch = useDispatch(); const { loading } = useSelector((state) => state.auction); const [startTime, setStartTime] = useState(null); const [endTime, setEndTime] = useState(null); const startId = useId(); const endId = useId();
  useEffect(() => { const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); }; if (open) window.addEventListener("keydown", closeOnEscape); return () => window.removeEventListener("keydown", closeOnEscape); }, [open, onClose]);
  if (!open) return null;
  const submit = (event) => { event.preventDefault(); if (!startTime || !endTime) return; dispatch(republishAuction(id, { startTime: startTime.toISOString(), endTime: endTime.toISOString() })); onClose(); };
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-4 sm:items-center sm:justify-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="republish-title" className="w-full max-w-xl rounded-xl bg-white p-5 sm:p-7"><h2 id="republish-title" className="text-2xl font-bold text-primary">Republish auction</h2><p className="mt-2 text-sm text-slate-600">Choose a new start and end time. Auctions with bids cannot be republished.</p><form onSubmit={submit} className="mt-6 space-y-5"><div><label htmlFor={startId} className="form-label">Start time</label><DatePicker id={startId} selected={startTime} onChange={setStartTime} minDate={new Date()} showTimeSelect timeIntervals={15} dateFormat="PPp" className="input-field" required /></div><div><label htmlFor={endId} className="form-label">End time</label><DatePicker id={endId} selected={endTime} onChange={setEndTime} minDate={startTime || new Date()} showTimeSelect timeIntervals={15} dateFormat="PPp" className="input-field" required /></div><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">Cancel</button><button type="submit" disabled={loading} className="rounded-md bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800 disabled:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">{loading ? "Republishing…" : "Republish Auction"}</button></div></form></section></div>;
};

CardTwo.propTypes = { imgSrc: PropTypes.string, title: PropTypes.string.isRequired, startingBid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), endTime: PropTypes.string.isRequired, id: PropTypes.string.isRequired };
RepublishDialog.propTypes = { id: PropTypes.string.isRequired, open: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
export default CardTwo;
