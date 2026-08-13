import { useState } from "react";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "@/lib/api";

const NewsletterSignup = () => {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setLoading(true); try { const { data } = await api.post("/newsletter/subscribe", { email }); toast.success(data.message); setEmail(""); } catch (error) { toast.error(getErrorMessage(error)); } finally { setLoading(false); } };
  return <section className="rounded-xl bg-primary px-5 py-8 text-white sm:px-8"><div className="max-w-xl"><p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Never miss a sale</p><h2 className="mt-2 text-2xl font-bold">Auction announcements in your inbox</h2><p className="mt-2 text-emerald-100">Receive upcoming-sale and collection highlights. You can unsubscribe whenever you choose.</p><form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="min-w-0 flex-1 rounded-md border border-white/30 bg-white px-4 py-3 text-slate-950"/><button disabled={loading} className="rounded-md bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-500 disabled:bg-amber-400">{loading ? "Joining..." : "Subscribe"}</button></form></div></section>;
};
export default NewsletterSignup;
