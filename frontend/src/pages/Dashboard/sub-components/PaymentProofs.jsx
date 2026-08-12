import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    if (window.confirm("Delete this payment proof? This cannot be undone.")) dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">User ID</th>
              <th className="w-1/3 py-2">Status</th>
              <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{element.userId}</td>
                    <td className="py-2 px-4 text-center">{element.status}</td>
                    <td className="flex items-center py-4 justify-center gap-3">
                      <button
                        className="rounded bg-primary px-3 py-1 text-white transition-colors hover:bg-emerald-900"
                        onClick={() => handleFetchPaymentDetail(element._id)}
                      >
                        Update
                      </button>
                      <button
                        className="rounded bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
                        onClick={() => handlePaymentProofDelete(element._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-primary py-3">
                <td>No payment proofs are found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export default PaymentProofs;

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState(singlePaymentProof.amount || "");
  const [status, setStatus] = useState(singlePaymentProof.status || "");

  useEffect(() => {
    setAmount(singlePaymentProof.amount || "");
    setStatus(singlePaymentProof.status === "Pending" ? "Approved" : singlePaymentProof.status || "");
  }, [singlePaymentProof]);

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  return (
    <>
      <section
        className={`fixed ${
          openDrawer && singlePaymentProof.userId ? "bottom-0" : "-bottom-full"
        } left-0 flex h-full w-full items-end bg-slate-950/60 transition-transform duration-300`}
      >
        <div className="h-fit w-full bg-white transition-transform duration-300">
          <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
            <h3 className="text-[#B7791F]  text-3xl font-semibold text-center mb-1">
              Update Payment Proof
            </h3>
            <p className="text-stone-600">
              You can update payment status and amount.
            </p>
            <form className="flex flex-col gap-5 my-5">
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600 ">User ID</label>
                <input
                  type="text"
                  value={singlePaymentProof.userId || ""}
                  disabled
                  onChange={(e) => e.target.value}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none  text-stone-600"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                >
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Comment</label>
                <textarea
                  rows={5}
                  value={singlePaymentProof.comment || ""}
                  onChange={(e) => e.target.value}
                  disabled
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none text-stone-600"
                />
              </div>
              <div>
                <Link
                  to={singlePaymentProof.proof?.url || ""}
                  className="flex w-full justify-center rounded-md bg-amber-700 py-2 text-xl font-semibold text-white transition-colors hover:bg-amber-800"
                  target="_blank"
                >
                  Payment Proof (SS)
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-primary py-2 text-xl font-semibold text-white transition-colors hover:bg-emerald-900"
                  onClick={handlePaymentProofUpdate}
                >
                  {loading ? "Updating Payment Proof" : "Update Payment Proof"}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-amber-700 py-2 text-xl font-semibold text-white transition-colors hover:bg-amber-800"
                  onClick={() => setOpenDrawer(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
