import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentGraph from "./sub-components/PaymentGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import Spinner from "@/custom-components/Spinner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.superAdmin);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (user.role !== "Super Admin" || !isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, user.role, navigateTo]);

  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="w-full h-screen flex items-center justify-center bg-gray-100">
        <Spinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">An error occurred: {error}</p>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex items-center justify-center bg-gray-100 py-10 my-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-6xl p-6">
        <h1 className="text-primary text-4xl font-bold mb-10 text-center">
          Dashboard
        </h1>
        <div className="flex flex-col gap-10">
          <DashboardSection title="Monthly Total Payments Received">
            <PaymentGraph />
          </DashboardSection>
          <DashboardSection title="Users">
            <BiddersAuctioneersGraph />
          </DashboardSection>
          <DashboardSection title="Payment Proofs">
            <PaymentProofs />
          </DashboardSection>
          <DashboardSection title="Delete Items From Auction">
            <AuctionItemDelete />
          </DashboardSection>
        </div>
      </div>
    </section>
  );
};

const DashboardSection = ({ title, children }) => (
  <div className="text-center">
    <h3 className="text-[#111] text-2xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default Dashboard;