import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const handleBid = () => {
    dispatch(placeBid(id, { amount: Number(amount) }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [dispatch, id]);
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="text-[16px] flex flex-wrap gap-2 items-center">
          <Link
            to="/"
            className="font-semibold transition-colors hover:text-amber-700"
          >
            Home
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <Link
            to={"/auctions"}
            className="font-semibold transition-colors hover:text-amber-700"
          >
            Auctions
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <p className="text-stone-600">{auctionDetail.title}</p>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="flex aspect-square w-full max-w-48 items-center justify-center rounded-lg bg-white p-5 lg:h-48">
                  <img
                    src={auctionDetail.image?.url}
                    alt={auctionDetail.title || "Auction item"}
                    width="192"
                    height="192"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col justify-around pb-4">
                  <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                    {auctionDetail.title}
                  </h3>
                  <p className="text-xl font-semibold">
                    Condition:{" "}
                    <span className="text-[#B7791F]">
                      {auctionDetail.condition}
                    </span>
                  </p>
                  <p className="text-xl font-semibold">
                    Minimum Bid:{" "}
                    <span className="text-[#B7791F]">
                      ${auctionDetail.startingBid}
                    </span>
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-bold">
                Auction Item Description
              </h2>
              <hr className="my-2 border-t-[1px] border-t-stone-700" />
              <ul className="list-disc space-y-2 pl-5 text-base text-slate-700">{auctionDetail.description &&
                auctionDetail.description.split(". ").filter(Boolean).map((element, index) => {
                  return (
                    <li key={index} className="text-[18px] my-2">
                      {element}
                    </li>
                  );
                })}</ul>
            </div>
            <div className="flex-1">
              <header className="bg-stone-200 py-4 text-[24px] font-semibold px-4">
                BIDS
              </header>
              <div className="min-h-72 rounded-b-lg bg-white px-4 lg:min-h-[650px]">
                {auctionBidders &&
                new Date(auctionDetail.startTime) < Date.now() &&
                new Date(auctionDetail.endTime) > Date.now() ? (
                  auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                        className="flex min-w-0 items-center justify-between gap-3 py-2"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="truncate text-base font-semibold">
                              {element.userName}
                            </p>
                          </div>
                          {index === 0 ? (
                            <p className="text-[20px] font-semibold text-primary">
                              1st
                            </p>
                          ) : index === 1 ? (
                            <p className="text-[20px] font-semibold text-amber-700">
                              2nd
                            </p>
                          ) : index === 2 ? (
                            <p className="text-[20px] font-semibold text-slate-600">
                              3rd
                            </p>
                          ) : (
                            <p className="text-[20px] font-semibold text-gray-600">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No bids for this auction
                    </p>
                  )
                ) : Date.now() < new Date(auctionDetail.startTime) ? (
                  <img
                    src="/notStarted.png"
                    alt="not-started"
                className="h-auto w-full max-h-[650px] object-contain"
                  />
                ) : (
                  <img
                    src="/auctionEnded.png"
                    alt="ended"
                className="h-auto w-full max-h-[650px] object-contain"
                  />
                )}
              </div>

              <div className="flex flex-col gap-3 rounded-b-lg bg-[#B7791F] px-4 py-4 text-base font-semibold sm:flex-row sm:items-center sm:justify-between sm:text-xl">
                {user?.role === "Bidder" && Date.now() >= new Date(auctionDetail.startTime) &&
                Date.now() <= new Date(auctionDetail.endTime) ? (
                  <>
                    <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                      <p className="text-white">Place Bid</p>
                      <input
                        type="number"
                        aria-label="Bid amount"
                        min={auctionDetail.currentBid || auctionDetail.startingBid}
                        step="0.01"
                        inputMode="decimal"
                        className="w-full rounded-md border border-white bg-white p-2 text-slate-950 sm:w-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <button
                      aria-label="Place bid"
                      className="rounded-md bg-slate-950 p-3 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      onClick={handleBid}
                    >
                      <RiAuctionFill />
                    </button>
                  </>
                ) : user?.role !== "Bidder" ? (
                  <p className="text-white font-semibold text-xl">Only bidders can place bids.</p>
                ) : new Date(auctionDetail.startTime) > Date.now() ? (
                  <p className="text-white font-semibold text-xl">
                    Auction has not started yet!
                  </p>
                ) : (
                  <p className="text-white font-semibold text-xl">
                    Auction has ended!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AuctionItem;
