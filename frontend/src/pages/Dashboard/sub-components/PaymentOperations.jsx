import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "@/lib/api";

const actions = {
  payout_pending: [["release_payout", "Release Demo Payout"]],
  refund_requested: [["approve_refund", "Approve Demo Refund"], ["reject_refund", "Reject Refund"]],
  disputed: [["resolve_dispute_release", "Resolve: Release Payout"], ["resolve_dispute_refund", "Resolve: Refund Buyer"]],
};

const PaymentOperations = () => {
  const [payments, setPayments] = useState([]); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const { data } = await api.get("/payments/admin/all"); setPayments(data.payments); } catch (error) { toast.error(getErrorMessage(error)); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const resolve = async (id, action) => { try { const { data } = await api.post(`/payments/admin/${id}/resolve`, { action }); toast.success(data.message); load(); } catch (error) { toast.error(getErrorMessage(error)); } };
  return <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 text-left"><p className="mb-4 text-sm text-amber-900">Demo mode only. These controls do not transfer funds.</p>{loading ? <p className="text-slate-600">Loading payment operations…</p> : payments.length ? <div className="space-y-3">{payments.map((payment) => <div key={payment._id} className="rounded-md border border-slate-200 bg-white p-4"><div className="flex flex-wrap justify-between gap-2"><strong>{payment.auction?.title || "Auction payment"}</strong><span className="text-sm font-semibold text-amber-800">{payment.status.replaceAll("_", " ")}</span></div><p className="mt-1 text-sm text-slate-600">Buyer: {payment.buyer?.userName} · Seller: {payment.seller?.userName} · LKR {Number(payment.amount).toFixed(2)}</p>{payment.refundReason && <p className="mt-2 text-sm text-slate-700"><strong>Refund:</strong> {payment.refundReason}</p>}{payment.disputeReason && <p className="mt-2 text-sm text-slate-700"><strong>Dispute:</strong> {payment.disputeReason}</p>}<div className="mt-3 flex flex-wrap gap-2">{(actions[payment.status] || []).map(([action, text]) => <button key={action} type="button" onClick={() => resolve(payment._id, action)} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900">{text}</button>)}</div></div>)}</div> : <p className="text-slate-600">No payment operations require review.</p>}</div>;
};
export default PaymentOperations;
