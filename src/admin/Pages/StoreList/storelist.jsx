import React from "react";
import { FaBusinessTime } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import  useStoreController  from "../../controller/store/store-list";
const Storelist = () => {
  const {
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    filteredList,
    fetchBusinessProfiles,
    formatDate,
    showProfiles,
    setShowProfiles,
    businessProfiles,
  } = useStoreController();

  return (
    <div className="mx-auto mt-5 p-4">
      {/* Header & Search */}
      <div className="flex justify-between items-center mb-6 border-b px-6 py-3">
        <h1 className="text-xl font-semibold text-gray-800">Store List</h1>
      </div>

      {/* Search & Page Size */}
      <div className="flex flex-row gap-5 flex-wrap border-b md:px-6 py-3 items-center mb-4">
        <div className="w-full md:w-52 relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by mobile or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2 py-2 border rounded bg-[#F6F8FA] text-sm placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Show
          </label>
          <select
            id="pageSize"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-[#F6F8FA]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto md:px-10 md:py-10 bg-[#00000000]">
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="p-3 font-medium">Sr No.</th>
              <th className="p-3 font-medium">Mobile</th>
              <th className="p-3 font-medium">Verified</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Last Login</th>
              <th className="p-3 font-medium">Created At</th>
              <th className="p-3 font-medium">Business Profile</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((store, idx) => (
              <tr key={store._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{(page - 1) * limit + idx + 1}</td>
                <td className="p-3">{store.mobile}</td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      store.is_verified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {store.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </td>
                <td className="p-3">{store.roles}</td>
                <td className="p-3">{formatDate(store.lastLogin)}</td>
                <td className="p-3">{formatDate(store.created_at)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => fetchBusinessProfiles(store._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaBusinessTime size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showProfiles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold transition"
              onClick={() => setShowProfiles(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Business Profiles
            </h2>

            {businessProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessProfiles.map((profile) => (
                  <div
                    key={profile._id}
                    className="border rounded-lg p-5 shadow-md bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">
                      {profile.businessName}
                    </h3>
                    <div className="text-gray-700 space-y-1">
                      <p><b>GST Number:</b> {profile.gstNumber}</p>
                      <p><b>Address:</b> {profile.address}, {profile.pincode}</p>
                      <p><b>Mobile:</b> {profile.mobile}</p>
                      <p><b>Email:</b> {profile.email}</p>
                      <p><b>Short Bio:</b> {profile.shortBio}</p>
                      <p><b>Industry:</b> {profile.industry}</p>
                      <p><b>Today Collection:</b> {profile.today_collection}</p>
                      <p><b>Total Collection:</b> {profile.total_collection}</p>
                      <p>
                        <b>Website:</b>{" "}
                        <a
                          href={profile.websiteURL}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.websiteURL}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                No business profiles found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Storelist;
