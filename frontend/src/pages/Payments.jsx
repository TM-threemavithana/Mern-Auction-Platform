import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeMockPayment, getMyPayments, openPaymentDispute, requestRefund } from "@/store/slices/paymentSlice";
import { isDemoMode } from "@/config/runtime";

const format = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 });
const label = (status) => status.replaceAll("_", " ");

const Payments = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.user);
  const [notes, setNotes] = useState({});

  useEffect(() => { dispatch(getMyPayments()); }, [dispatch]);
  const submit = (id, type) => {
    const reason = notes[id] || "";
    if (reason.trim().length < 10) return;
    dispatch(type === "refund" ? requestRefund(id, reason) : openPaymentDispute(id, reason));
  };

  return <section className="mx-auto min-h-[calc(100vh-12rem)] max-w-5xl px-4 py-10 sm:px-6">
    <div><p className="text-sm font-semibold uppercase tracking-wide text-amber-700">{isDemoMode ? "Demo payment centre" : "Payments"}</p><h1 className="mt-2 text-3xl font-bold text-slate-950">My payments</h1><p className="mt-2 max-w-2xl text-slate-600">{isDemoMode ? "Demo mode only — no card data is collected and no funds are transferred." : "Payment records and support requests appear here. Checkout is available only through a configured payment provider."}</p></div>
    {loading && !payments.length ? <p className="mt-8 text-slate-600" aria-live="polite">Loading payments…</p> : payments.length ? <div className="mt-8 grid gap-5">{payments.map((payment) => <article key={payment._id} className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-bold text-slate-900">{payment.auction?.title || "Auction payment"}</h2><p className="mt-1 text-sm text-slate-600">{user.role === "Bidder" ? `Seller: ${payment.seller?.userName || "—"}` : `Buyer: ${payment.buyer?.userName || "—"}`}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">{label(payment.status)}</span></div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3"><p><span className="text-slate-500">Total</span><br/><strong>{format.format(payment.amount)}</strong></p><p><span className="text-slate-500">Platform fee</span><br/><strong>{format.format(payment.platformFee)}</strong></p><p><span className="text-slate-500">Seller receives</span><br/><strong>{format.format(payment.sellerAmount)}</strong></p></div>
      {isDemoMode && user.role === "Bidder" && payment.status === "awaiting_payment" && <button type="button" onClick={() => dispatch(completeMockPayment(payment._id))} disabled={loading} className="mt-5 rounded-md bg-amber-700 px-4 py-2 font-semibold text-white hover:bg-amber-800 disabled:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2">Complete Demo Payment</button>}
      {user.role === "Bidder" && ["payout_pending", "payout_released"].includes(payment.status) && <div className="mt-5 border-t border-slate-100 pt-4"><label htmlFor={`note-${payment._id}`} className="form-label">Refund or dispute reason</label><textarea id={`note-${payment._id}`} name={`note-${payment._id}`} rows="3" value={notes[payment._id] || ""} onChange={(event) => setNotes((value) => ({ ...value, [payment._id]: event.target.value }))} className="input-field" placeholder="Explain the issue in at least 10 characters…" autoComplete="off"/><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => submit(payment._id, "refund")} className="rounded-md border border-amber-700 px-4 py-2 font-semibold text-amber-800 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2">Request Refund</button><button type="button" onClick={() => submit(payment._id, "dispute")} className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2">Open Dispute</button></div></div>}
    </article>)}</div> : <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">There are no payment records yet.</div>}
  </section>;
};

export default Payments;
