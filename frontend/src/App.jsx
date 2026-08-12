import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SubmitCommission from "./pages/SubmitCommission";
import { useDispatch } from "react-redux";
import { fetchLeaderboard, fetchUser } from "./store/slices/userSlice";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import Leaderboard from "./pages/Leaderboard";
import Auctions from "./pages/Auctions";
import AuctionItem from "./pages/AuctionItem";
import CreateAuction from "./pages/CreateAuction";
import ViewMyAuctions from "./pages/ViewMyAuctions";
import ViewAuctionDetails from "./pages/ViewAuctionDetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import {Footer} from "../src/layout/Footer";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, [dispatch]);
  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SideDrawer />
      <main id="main-content" className="min-h-[calc(100vh-4rem)]">
      <Routes>
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
        
      </Routes>
      </main>
      <Footer/>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
