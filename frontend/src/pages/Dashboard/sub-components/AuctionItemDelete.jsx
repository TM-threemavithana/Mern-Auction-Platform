import { deleteAuctionItem } from "@/store/slices/superAdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuctionItemDelete = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const handleAuctionDelete = (id, title) => {
    if (window.confirm(`Delete “${title}”? This cannot be undone.`)) dispatch(deleteAuctionItem(id));
  };

  return (
    <>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {allAuctions.length > 0 ? (
              allAuctions.map((element) => {
                return (
                  <tr key={element._id}>
                    <td className="py-2 px-4">
                      <img
                        src={element.image?.url}
                        alt={element.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4">{element.title}</td>
                    <td className="py-2 px-4 flex space-x-2">
                      <Link
                        to={`/auction/details/${element._id}`}
                        className="rounded-md bg-primary px-3 py-1 text-white transition-colors hover:bg-emerald-900"
                      >
                        View
                      </Link>
                      <button
                        className="rounded-md bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
                        onClick={() => handleAuctionDelete(element._id, element.title)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-left text-xl text-primary py-3">
                <td>No Auctions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AuctionItemDelete;
