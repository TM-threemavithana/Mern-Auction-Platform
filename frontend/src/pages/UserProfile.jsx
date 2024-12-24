import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  return (
    <section className="w-full h-full flex flex-col items-center justify-start bg-gray-100">
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6 mt-10">
          <div className="flex flex-col items-center">
            <img
              src={user.profileImage?.url}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-gray-200 shadow-lg"
            />
            <h2 className="text-2xl font-bold mt-4">{user.userName}</h2>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email" value={user.email} />
              <InputField label="Phone" value={user.phone} type="number" />
              <InputField label="Address" value={user.address} />
              <InputField label="Role" value={user.role} />
              <InputField label="Joined On" value={user.createdAt?.substring(0, 10)} />
            </div>
          </div>

          {user.role === "Auctioneer" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Bank Name" value={user.paymentMethods.bankTransfer.bankName} />
                <InputField label="Bank Account (IBAN)" value={user.paymentMethods.bankTransfer.bankAccountNumber} />
                <InputField label="User Name On Bank Account" value={user.paymentMethods.bankTransfer.bankAccountName} />
                <InputField label="Easypaisa Account Number" value={user.paymentMethods.easypaisa.easypaisaAccountNumber} />
                <InputField label="Paypal Email" value={user.paymentMethods.paypal.paypalEmail} />
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Other User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.role === "Auctioneer" && (
                <InputField label="Unpaid Commissions" value={user.unpaidCommission} />
              )}
              {user.role === "Bidder" && (
                <>
                  <InputField label="Auctions Won" value={user.auctionsWon} />
                  <InputField label="Money Spent" value={user.moneySpent} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const InputField = ({ label, value, type = "text" }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        disabled
      />
    </div>
  );
};

export default UserProfile;
