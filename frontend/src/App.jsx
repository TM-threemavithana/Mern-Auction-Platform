import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard, fetchUser } from "./store/slices/userSlice";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { isDemoMode } from "./config/runtime";
import {Footer} from "../src/layout/Footer";

const SignUp = lazy(() => import("./pages/SignUp")); const Login = lazy(() => import("./pages/Login")); const SubmitCommission = lazy(() => import("./pages/SubmitCommission")); const HowItWorks = lazy(() => import("./pages/HowItWorks")); const About = lazy(() => import("./pages/About")); const Leaderboard = lazy(() => import("./pages/Leaderboard")); const Auctions = lazy(() => import("./pages/Auctions")); const AuctionItem = lazy(() => import("./pages/AuctionItem")); const CreateAuction = lazy(() => import("./pages/CreateAuction")); const ViewMyAuctions = lazy(() => import("./pages/ViewMyAuctions")); const ViewAuctionDetails = lazy(() => import("./pages/ViewAuctionDetails")); const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard")); const Contact = lazy(() => import("./pages/Contact")); const UserProfile = lazy(() => import("./pages/UserProfile")); const Payments = lazy(() => import("./pages/Payments")); const Watchlist = lazy(() => import("./pages/Watchlist")); const ValuationRequest = lazy(() => import("./pages/ValuationRequest")); const Policies = lazy(() => import("./pages/Policies")); const AuctionCalendar = lazy(() => import("./pages/AuctionCalendar")); const Highlights = lazy(() => import("./pages/PublicInfo").then((module) => ({ default: module.Highlights }))); const Stories = lazy(() => import("./pages/PublicInfo").then((module) => ({ default: module.Stories }))); const Trust = lazy(() => import("./pages/PublicInfo").then((module) => ({ default: module.Trust }))); const Legal = lazy(() => import("./pages/PublicInfo").then((module) => ({ default: module.Legal }))); const AuctionServices = lazy(() => import("./pages/AuctionServices")); const StaffOperations = lazy(() => import("./pages/StaffOperations")); const ServiceUnavailable = lazy(() => import("./pages/ServiceUnavailable"));

const App = () => {
  const dispatch = useDispatch();
  const apiUnavailable = useSelector((state) => state.auction.apiUnavailable);
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, [dispatch]);
  if (apiUnavailable && !isDemoMode) return <ServiceUnavailable />;
  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SideDrawer />
      <main id="main-content" className="min-h-[calc(100vh-4rem)]">
      <Suspense fallback={<p className="mx-auto max-w-7xl px-4 py-10 text-slate-600" aria-live="polite">Loading page…</p>}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit-commission" element={<ProtectedRoute roles={["Auctioneer"]}><SubmitCommission /></ProtectedRoute>} />
        <Route path="/how-it-works-info" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/item/:id" element={<ProtectedRoute><AuctionItem /></ProtectedRoute>} />
        <Route path="/create-auction" element={<ProtectedRoute roles={["Auctioneer"]}><CreateAuction /></ProtectedRoute>} />
        <Route path="/view-my-auctions" element={<ProtectedRoute roles={["Auctioneer"]}><ViewMyAuctions /></ProtectedRoute>} />
        <Route path="/auction/details/:id" element={<ProtectedRoute roles={["Auctioneer", "Super Admin"]}><ViewAuctionDetails /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute roles={["Super Admin"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/me" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute roles={["Bidder", "Auctioneer"]}><Payments /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute roles={["Bidder"]}><Watchlist /></ProtectedRoute>} />
        <Route path="/request-valuation" element={<ProtectedRoute roles={["Auctioneer"]}><ValuationRequest /></ProtectedRoute>} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/calendar" element={<AuctionCalendar />} />
        <Route path="/results" element={<AuctionCalendar results />} />
        <Route path="/highlights" element={<Highlights />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/our-standards" element={<Trust />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route path="/buyer-agreement" element={<Legal type="buyer" />} />
        {isDemoMode && <Route path="/auction-services" element={<AuctionServices />} />}
        <Route path="/staff-operations" element={<ProtectedRoute roles={["Super Admin"]}><StaffOperations /></ProtectedRoute>} />
        
      </Routes></Suspense>
      </main>
      <Footer/>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
