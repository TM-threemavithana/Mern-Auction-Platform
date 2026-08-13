import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="mt-12 border-t border-emerald-800 bg-primary text-emerald-100">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><p className="text-lg font-bold text-white">BidSpirit</p><p className="mt-3 max-w-sm text-sm leading-6 text-emerald-100/80">A simple, transparent place to discover items, place bids, and manage auctions.</p></div>
      <div><h2 className="text-sm font-semibold text-white">Explore</h2><ul className="mt-3 space-y-2 text-sm text-emerald-100/80"><li><Link to="/auctions" className="transition-colors hover:text-amber-200">Auctions</Link></li><li><Link to="/calendar" className="transition-colors hover:text-amber-200">Auction calendar</Link></li><li><Link to="/results" className="transition-colors hover:text-amber-200">Past results</Link></li><li><Link to="/highlights" className="transition-colors hover:text-amber-200">Highlights</Link></li><li><Link to="/stories" className="transition-colors hover:text-amber-200">Stories</Link></li></ul></div>
      <div><h2 className="text-sm font-semibold text-white">Support</h2><ul className="mt-3 space-y-2 text-sm text-emerald-100/80"><li><Link to="/about" className="transition-colors hover:text-amber-200">About</Link></li><li><Link to="/contact" className="transition-colors hover:text-amber-200">Contact</Link></li><li><Link to="/our-standards" className="transition-colors hover:text-amber-200">Our standards</Link></li><li><Link to="/buyer-agreement" className="transition-colors hover:text-amber-200">Buyer agreement</Link></li><li><Link to="/terms" className="transition-colors hover:text-amber-200">Terms</Link></li><li><Link to="/privacy" className="transition-colors hover:text-amber-200">Privacy</Link></li></ul></div>
    </div>
    <div className="border-t border-emerald-800 px-4 py-4 text-center text-xs text-emerald-100/70">© {new Date().getFullYear()} BidSpirit. All rights reserved.</div>
  </footer>
);
