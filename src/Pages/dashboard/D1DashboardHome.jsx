import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import {
  FaArrowUp, FaArrowDown, FaPlus, FaClock,
  FaRupeeSign, FaPhoneAlt, FaWhatsapp, FaEnvelope
} from "react-icons/fa";
import { Phone, ShoppingCart, CreditCard, Wallet } from "lucide-react";
import { GoGraph } from "react-icons/go";
import { dashboard } from "../../api/dashboard.js";

const TRANSACTION_TYPE_MAP = {
  Purchase: {
    bg: "bg-[#FEE2E2]",
    icon: <ShoppingCart color="#DC2626" />,
    cardBg: "bg-red-50",
    text: "text-red-600",
    percentText: "text-red-500",
  },
  Expense: {
    bg: "bg-[#FFEDD5]",
    icon: <CreditCard color="#EA580C" />,
    cardBg: "bg-orange-50",
    text: "text-orange-500",
    percentText: "text-red-500",
  },
  Collection: {
    bg: "bg-[#DCFCE7]",
    icon: <Phone color="#16A34A" />,
    cardBg: "bg-green-50",
    text: "text-green-600",
    percentText: "text-green-600",
  },
};

const STAT_CARD_TYPE_MAP = {
  sale: { icon: <GoGraph color="#16A34A" size={20} />, bg: "bg-[#DCFCE7]" },
  paid: { icon: <Wallet color="#2563EB" size={20} />, bg: "bg-[#DBEAFE]" },
  pending: { icon: <FaClock color="#EA580C" size={20} />, bg: "bg-[#FFEDD5]" },
};

const StatCard = ({ title, value, change, isPositive, type }) => {
  const config = STAT_CARD_TYPE_MAP[type] || {};
  return (
    <div className="bg-white shadow-customSoft rounded-lg p-4 flex justify-between items-center w-full mt-5">
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={`text-sm flex items-center gap-1 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? <FaArrowUp /> : <FaArrowDown />} {change}
          <span className="text-gray-500"> vs last month</span>
        </div>
      </div>
      <div className={`p-2 rounded-full ${config.bg}`}>{config.icon}</div>
    </div>
  );
};

const D1DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboard.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">⏳ Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">🚨 {error}</div>;
  }
  if (!dashboardData) return null;

  const {
    totalSum,
    paidSum,
    pendingSum,
    purchaseArr,
    collectionArr,
  } = dashboardData;

  const graphData = [
    { month: "Jul 2024", sales: 18, collection: 16 },
    { month: "Aug 2024", sales: 19, collection: 17 },
    { month: "Sep 2024", sales: 18, collection: 18 },
    { month: "Oct 2024", sales: 19, collection: 19 },
    { month: "Nov 2024", sales: 18, collection: 18 },
    { month: "Dec 2024", sales: 18, collection: 17 },
  ];

  const allTransactions = purchaseArr?.map((p) => ({
    date: p.purchaseDate,
    type: "Purchase",
    description: p.purchaseInvoiceNumber,
    amount: p.purchaseTotalAmount,
    status: p.purchaseStatus,
  }));

  const filteredTransactions =
    selectedType === "Collection"
      ? collectionArr
      : selectedType === "All"
      ? allTransactions
      : allTransactions.filter((t) => t.type === selectedType);

  const renderTransactionCard = (type, title, amount, percent) => {
    const config = TRANSACTION_TYPE_MAP[type];
    return (
      <div
        className={`flex items-center justify-between p-5 rounded-lg shadow-customSoft ${config.cardBg} cursor-pointer`}
        onClick={() => setSelectedType(type)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${config.bg}`}>{config.icon}</div>
          <div>
            <div className="font-medium text-gray-800">{title}</div>
            <div className="text-xs text-gray-500">Monthly Total</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-semibold ${config.text}`}>{amount}</div>
          <div className={`text-xs ${config.percentText}`}>{percent}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* --- Stats --- */}
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard title="Monthly Sale" value={`₹${totalSum}`} change="12%" isPositive type="sale" />
        <StatCard title="Monthly Paid" value={`₹${paidSum}`} change="3%" isPositive type="paid" />
        <StatCard title="Monthly Pending" value={`₹${pendingSum}`} change="4%" isPositive={false} type="pending" />
      </div>

      {/* --- Chart --- */}
      <div className="bg-white p-4 rounded-lg shadow-customSoft">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Sales & Collection Overview</h2>
          <span className="text-sm border rounded px-2 py-1">Last 6 Months</span>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={graphData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#0f9afe" radius={[10, 10, 0, 0]} />
            <Bar dataKey="collection" fill="#00e0a3" radius={[14, 14, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Cashbook --- */}
      <div className="bg-white p-4 rounded-lg shadow-customSoft">
        <h2 className="font-semibold mb-4">Cashbook Transactions</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {renderTransactionCard("Purchase", "Purchases", "₹8.5L", "+5.2%")}
          {renderTransactionCard("Expense", "Expenses", "₹3.2L", "-2.1%")}
          {renderTransactionCard("Collection", "Collections", "156", "+18.3%")}
        </div>
      </div>

      {/* --- Transactions Table --- */}
      <div className="bg-white p-4 rounded-lg shadow-customSoft">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">Recent Transactions</h2>
          <button
            onClick={() => setSelectedType("All")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] text-sm w-full">
            <thead>
              <tr className="border-b text-gray-500">
                {selectedType === "Collection" ? (
                  <>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Due Amount</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </>
                ) : (
                  <>
                    <th className="p-3">Date</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.map((txn, i) =>
                selectedType === "Collection" ? (
                  <tr key={i} className="border-t">
                    <td className="p-3">{txn.ClientName}</td>
                    <td className="p-3 font-medium">₹{txn.collectionTotalAmount}</td>
                    <td className="p-3">{txn.collectionDueDate}</td>
                    <td className="p-3">{txn.clientPhone}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-3 text-gray-600 text-lg">
                      <FaPhoneAlt className="cursor-pointer text-blue-600" />
                      <FaWhatsapp className="cursor-pointer text-green-500" />
                      <FaEnvelope className="cursor-pointer text-blue-500" />
                    </td>
                  </tr>
                ) : (
                  <tr key={i} className="border-t">
                    <td className="p-3">{txn.date}</td>
                    <td className="p-3">{txn.type}</td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3 font-medium">₹{txn.amount}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Add Button --- */}
      <div className="flex justify-center py-8">
        <div className="bg-red-600 px-6 py-3 rounded-full text-white flex gap-2 shadow-md cursor-pointer">
          <FaPlus /> Add Button
        </div>
      </div>
    </div>
  );
};

export default D1DashboardHome;
