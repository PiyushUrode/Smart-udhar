import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaClock,
  FaRupeeSign,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { Phone, ShoppingCart, CreditCard, Wallet } from "lucide-react";
import { GoGraph } from "react-icons/go";
import ExpenseService from "../../api/expenseservice";
import { AuthService } from "../../api/authservice";

const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Generate last 6 months with year+month info
const last6Months = (() => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("default", { month: "short", year: "numeric" }),
      year: d.getFullYear(),
      month: d.getMonth() + 1, // 1–12
    });
  }
  return months;
})();

function formatMonth(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short", year: "numeric" });
}

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
  sale: {
    icon: <GoGraph color="#16A34A" size={20} />,
    bg: "bg-[#DCFCE7]",
  },
  paid: {
    icon: <Wallet color="#2563EB" size={20} />,
    bg: "bg-[#DBEAFE]",
  },
  pending: {
    icon: <FaClock color="#EA580C" size={20} />,
    bg: "bg-[#FFEDD5]",
  },
};

const StatCard = ({ title, value, change, isPositive, type }) => {
  const config = STAT_CARD_TYPE_MAP[type] || {};
  return (
    <div className="bg-white shadow-customSoft rounded-lg p-4 flex justify-between items-center w-full mt-5">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-[#4B5563] font-robotoM">{title}</div>
        <div className="text-2xl text-black font-robotoB font-bold">{value}</div>
        <div
          className={`text-sm flex items-center font-robotB font-bold gap-1 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? <FaArrowUp /> : <FaArrowDown />} {change}
          <span className="text-[#4B5563] font-robotB font-medium">
            {" "}
            vs last month
          </span>
        </div>
      </div>
      <div className={`p-2 rounded-full shadow ${config.bg}`}>
        {config.icon}
      </div>
    </div>
  );
};

const TransactionItem = ({ date, type, description, amount, status }) => (
  <tr className="border-t text-sm bg-white">
    <td className="p-5 text-gray-700">{date}</td>
    <td className="p-5">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          type === "Purchase"
            ? "bg-[#DCFCE7] text-[#166534]"
            : type === "Expense"
            ? "bg-[#FEE2E2] text-[#991B1B]"
            : "bg-[#FFEDD5] text-[#9A3412]"
        }`}
      >
        {type}
      </span>
    </td>
    <td className="p-5 text-gray-700">{description}</td>
    <td className="p-5 font-medium text-gray-800">₹{amount}</td>
    <td className="p-5">
      <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-700">
        {status}
      </span>
    </td>
  </tr>
);

// ----------------- Helpers -----------------
function getAuthContext() {
  const token = AuthService.getToken?.();
  const store_id =
    typeof AuthService.getStoreId === "function" && AuthService.getStoreId();
  const storeProfile_id =
    typeof AuthService.getstoreProfile_id === "function" &&
    AuthService.getstoreProfile_id();

  const finalStoreProfileId =
    storeProfile_id || localStorage.getItem("storeProfile_id");

  if (!token) throw new Error("❌ Missing auth token");
  if (!store_id) throw new Error("❌ Missing store_id");
  if (!finalStoreProfileId) throw new Error("❌ Missing storeProfile_id");

  return { token, store_id, storeProfile_id: finalStoreProfileId };
}

const D1DashboardHome = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  // 🔹 Fetch Expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoadingExpenses(true);
        const res = await ExpenseService.getAllExpenses();
        setExpenses(res?.data || res?.expenses || []);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoadingExpenses(false);
      }
    };
    fetchExpenses();
  }, []);

  // 🔹 Fetch last 6 months dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { token, store_id, storeProfile_id } = getAuthContext();

        const results = await Promise.all(
          last6Months.map(({ year, month }) =>
            axios.get(
              `${API_URL}/store-invoice/dashboard-export/${store_id}/${storeProfile_id}?year=${year}&month=${month}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );

        // Combine data month by month
        const combinedGraph = last6Months.map((m, idx) => {
          const res = results[idx].data;
          let sales = 0;
          let collection = 0;

          res.purchaseArr?.forEach(
            (p) => (sales += p.purchaseTotalAmount || 0)
          );
          res.collectionArr?.forEach(
            (c) => (collection += c.collectionTotalAmount || 0)
          );

          return {
            month: m.label,
            sales,
            collection,
          };
        });

        setGraphData(combinedGraph);
        setDashboardData(results[results.length - 1].data); // latest month for stat cards + transactions
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ✅ Purchase + Expense combined
  const allTransactions = [
    ...(dashboardData?.purchaseArr?.map((item) => ({
      date: item.purchaseDate,
      type: "Purchase",
      description: `Invoice - ${item.purchaseInvoiceNumber}`,
      amount: item.purchaseTotalAmount,
      status: item.purchaseStatus,
    })) || []),
    ...(dashboardData?.expenseArr?.map((item) => ({
      date: item.expenseDate,
      type: "Expense",
      description: `Expense - ${item.expenseInvoiceNumber || item.note || ""}`,
      amount: item.expenseTotalAmount,
      status: item.expenseStatus,
    })) || []),
  ];

  const collectionData =
    dashboardData?.collectionArr?.map((item) => ({
      name: item.ClientName,
      dueAmount: `₹${item.collectionTotalAmount}`,
      dueDate: item.collectionDueDate || "N/A",
      contact: item.clientPhone,
      status: item.status || "N/A",
    })) || [];

  const filteredTransactions =
    selectedType === "Collection"
      ? collectionData
      : selectedType === "Expense"
      ? expenses.map((exp) => ({
          date: exp.date,
          type: "Expense",
          description: exp.itemName || exp.expenseCategory,
          amount: exp.amount,
          status: exp.paymentMode || "—",
        }))
      : allTransactions;

  const renderTransactionCard = (type, title, amount, percent) => {
    const config = TRANSACTION_TYPE_MAP[type];
    return (
      <div
        className={`flex items-center justify-between p-5  shadow-customSoft rounded-lg ${config.cardBg} cursor-pointer`}
        onClick={() => setSelectedType(type)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full shadow ${config.bg}`}>
            {config.icon}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{title}</div>
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-2 md:p-6 space-y-6 overflow-hidden">
      {/* ✅ Stat Cards with API values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Monthly Sale"
          value={`₹${dashboardData?.totalSum || 0}`}
          change="12.9%"
          isPositive
          type="sale"
        />
        <StatCard
          title="Monthly Paid"
          value={`₹${dashboardData?.paidSum || 0}`}
          change="2.3%"
          isPositive
          type="paid"
        />
        <StatCard
          title="Monthly Pending"
          value={`₹${dashboardData?.pendingSum || 0}`}
          change="4.3%"
          isPositive={false}
          type="pending"
        />
      </div>

      {/* ✅ Chart */}
      <div className="grid grid-cols-1">
        <div className="bg-white p-4 shadow-customSoft rounded-lg">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Sales & Collection Overview
            </h2>
            <span className="text-sm border rounded px-2 py-1">
              Last 6 Months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={400}>
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
      </div>

      {/* ✅ Transaction Cards */}
      <div className="w-full">
        <div className="bg-white p-4 shadow-customSoft rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Cashbook Transactions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
            <div>
              {renderTransactionCard("Purchase", "Purchase", "₹8.5L", "+5.2%")}
            </div>
            <div>
              {renderTransactionCard("Expense", "Expense", "₹3.2L", "-2.1%")}
            </div>
            <div>
              {renderTransactionCard(
                "Collection",
                "Collection Calls",
                "156",
                "+18.3%"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Transactions Table */}
      <div className="bg-white p-4 shadow-customSoft rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <button
            onClick={() => setSelectedType("All")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] text-left w-full">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                {selectedType === "Collection" ? (
                  <>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Due Amount</th>
                    <th className="p-5">Due Date</th>
                    <th className="p-5">Contact</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Action</th>
                  </>
                ) : (
                  <>
                    <th className="p-5">Date</th>
                    <th className="p-5">Type</th>
                    <th className="p-5">Description</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {selectedType === "Expense" && loadingExpenses ? (
                <tr>
                  <td colSpan="6" className="text-center p-5 text-gray-500">
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                selectedType === "Collection" ? (
                  filteredTransactions.map((txn, idx) => (
                    <tr key={idx} className="border-t text-sm bg-white">
                      <td className="p-5 text-gray-700">{txn.name}</td>
                      <td className="p-5 text-gray-800 font-medium">
                        {txn.dueAmount}
                      </td>
                      <td className="p-5 text-gray-700">{txn.dueDate}</td>
                      <td className="p-5 text-gray-700">{txn.contact}</td>
                      <td className="p-5">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            txn.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : txn.status === "Reminder Sent"
                              ? "bg-blue-100 text-blue-700"
                              : txn.status === "Overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="p-5 flex gap-3 text-[20px] text-gray-600">
                        <FaPhoneAlt className="cursor-pointer hover:text-green-600 text-[#2563EB]" />
                        <FaWhatsapp className="cursor-pointer hover:text-green-500 text-[#60D669]" />
                        <FaEnvelope className="cursor-pointer hover:text-blue-500 text-[#2563EB]" />
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredTransactions.map((txn, idx) => (
                    <TransactionItem key={idx} {...txn} />
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-5 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full justify-center flex py-10">
        <div className="bg-[#EB2525] px-6 py-4 rounded-full text-white flex gap-5 shadow-md">
          <FaPlus /> Add Button
        </div>
      </div>
    </div>
  );
};

export default D1DashboardHome;
