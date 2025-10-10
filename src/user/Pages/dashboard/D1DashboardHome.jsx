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
import { AuthService } from "../../api/authservice.js";
import ExpenseService from "../../api/expenseservice.js";

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


// 🔹 Format date to dd-mm-yyyy
// 🕒 Convert ISO date → dd-mm-yyyy format
const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


// 🔹 Get current month start and end date
function getCurrentMonthRange() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
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
            vs last month
          </span>
        </div>
      </div>
      <div className={`p-2 rounded-full shadow ${config.bg}`}>{config.icon}</div>
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


const formatCurrencyCompact = (amount) => {
  if (amount == null) return "₹0";
  const a = Number(amount);
  if (Math.abs(a) >= 100000) {
    const lakhs = a / 100000;
    return `₹${lakhs >= 10 ? Math.round(lakhs) : lakhs.toFixed(1)}L`;
  }
  return `₹${new Intl.NumberFormat("en-IN").format(Math.round(a))}`;
};

const computePercentChange = (current, previous) => {
  current = Number(current || 0);
  previous = Number(previous || 0);
  if (previous === 0) {
    if (current === 0) return 0;
    return null;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const formatPercentForUI = (pct) => {
  if (pct === null) return "New";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
};
 
const D1DashboardHome = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
   const [statValues, setStatValues] = useState({
    sale: { value: 0, pct: "—", isPositive: true },
    paid: { value: 0, pct: "—", isPositive: true },
    pending: { value: 0, pct: "—", isPositive: true },
  });
    const [transactionStats, setTransactionStats] = useState({});

  // 🔹 Fetch Expenses
 useEffect(() => {
  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);

      // Fetch all expenses
      const res = await ExpenseService.filterExpenses();
      let allExpenses = res?.data || res?.expenses || [];

      // Get current month range
      const { startDate, endDate } = getCurrentMonthRange();

      // Filter only current month expenses
      const currentMonthExpenses = allExpenses.filter((e) => {
        const expenseDate = new Date(e.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });

      // Sort by date descending (latest first)
      const sortedExpenses = currentMonthExpenses.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Take only the last 10
      const latest10Expenses = sortedExpenses.slice(0, 10);

      // Update state
      setExpenses(latest10Expenses);

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

      // Fetch dashboard data month by month
      const results = await Promise.all(
        last6Months.map(({ year, month }) =>
          axios.get(
            `${API_URL}/store-invoice/dashboard-export/${store_id}/${storeProfile_id}?year=${year}&month=${month}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      // Combine data for graph
      const combinedGraph = last6Months.map((m, idx) => {
        const res = results[idx].data;
        let sales = 0;
        let collection = 0;
        res.purchaseArr?.forEach((p) => (sales += p.purchaseTotalAmount || 0));
        res.collectionArr?.forEach(
          (c) => (collection += c.collectionTotalAmount || 0)
        );
        return { month: m.label, sales, collection };
      });
      setGraphData(combinedGraph);

      // Latest and previous month for stat cards
      const curr = results[results.length - 1].data || {};
      const prev = results[results.length - 2]?.data || {};

      const saleCurr = curr.totalSum || 0;
      const salePrev = prev.totalSum || 0;
      const paidCurr = curr.paidSum || 0;
      const paidPrev = prev.paidSum || 0;

      // 🔹 Pending calculation (invoice pending + same month expenses only)
      const currMonthObj = last6Months[last6Months.length - 1];
      const prevMonthObj = last6Months[last6Months.length - 2];

      const currMonthExpenses = expenses
        .filter(
          (e) =>
            new Date(e.date).getMonth() + 1 === currMonthObj.month &&
            new Date(e.date).getFullYear() === currMonthObj.year
        )
        .reduce((s, e) => s + (e.amount || 0), 0);

      const prevMonthExpenses = expenses
        .filter(
          (e) =>
            new Date(e.date).getMonth() + 1 === prevMonthObj.month &&
            new Date(e.date).getFullYear() === prevMonthObj.year
        )
        .reduce((s, e) => s + (e.amount || 0), 0);

      const pendingCurr = (saleCurr - paidCurr) + currMonthExpenses;
      const pendingPrev = (salePrev - paidPrev) + prevMonthExpenses;

      // Percentage changes
      const salePct = computePercentChange(saleCurr, salePrev);
      const paidPct = computePercentChange(paidCurr, paidPrev);
      const pendingPct = computePercentChange(pendingCurr, pendingPrev);

      setStatValues({
        sale: {
          value: `₹${saleCurr}`,
          pct: formatPercentForUI(salePct),
          isPositive: salePct === null ? true : salePct >= 0,
        },
        paid: {
          value: `₹${paidCurr}`,
          pct: formatPercentForUI(paidPct),
          isPositive: paidPct === null ? true : paidPct >= 0,
        },
        pending: {
          value: `₹${pendingCurr}`,
          pct: formatPercentForUI(pendingPct),
          isPositive: pendingPct === null ? false : pendingPct <= 0,
        },
      });

      // 🔹 Aggregated totals for transaction cards
      const aggregated = results.map((r, idx) => {
        const d = r.data || {};
        const monthObj = last6Months[idx];

        const purchaseTotal = (d.purchaseArr || []).reduce(
          (s, p) => s + (p.purchaseTotalAmount || 0),
          0
        );

        const expenseTotal = expenses
          .filter(
            (e) =>
              new Date(e.date).getMonth() + 1 === monthObj.month &&
              new Date(e.date).getFullYear() === monthObj.year
          )
          .reduce((s, e) => s + (e.amount || 0), 0);

        const collectionTotal = (d.collectionArr || []).reduce(
          (s, c) => s + (c.collectionTotalAmount || 0),
          0
        );

        return { purchaseTotal, expenseTotal, collectionTotal };
      });

      const curr1 = aggregated[aggregated.length - 1] || {
        purchaseTotal: 0,
        expenseTotal: 0,
        collectionTotal: 0,
      };
      const prev1 = aggregated[aggregated.length - 2] || {
        purchaseTotal: 0,
        expenseTotal: 0,
        collectionTotal: 0,
      };

      setTransactionStats({
        purchaseAmount: curr1.purchaseTotal,
        purchasePct: formatPercentForUI(
          computePercentChange(curr1.purchaseTotal, prev1.purchaseTotal)
        ),
        expenseAmount: curr1.expenseTotal,
        expensePct: formatPercentForUI(
          computePercentChange(curr1.expenseTotal, prev1.expenseTotal)
        ),
        collectionAmount: curr1.collectionTotal,
        collectionPct: formatPercentForUI(
          computePercentChange(curr1.collectionTotal, prev1.collectionTotal)
        ),
      });

      // Set latest dashboard data
      setDashboardData(curr);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [expenses]); // 🔹 expenses included as dependency




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
          date: formatDate(exp.date),
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
          value={statValues.sale.value}
          change={statValues.sale.pct}
          isPositive={statValues.sale.isPositive}
          type="sale"
        />
        <StatCard
          title="Monthly Paid"
          value={statValues.paid.value}
          change={statValues.paid.pct}
          isPositive={statValues.paid.isPositive}
          type="paid"
        />
        <StatCard
          title="Monthly Pending"
          value={statValues.pending.value}
          change={statValues.pending.pct}
          isPositive={statValues.pending.isPositive}
          type="pending"
        />
      </div>

      {/* ✅ Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 w-full ">
        <div className="bg-white p-3 sm:p-4 md:p-5 shadow-customSoft rounded-lg w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Sales & Collection Overview
            </h2>
            <span className="text-sm border rounded px-2 py-1">
              Last 6 Months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={400} minHeight={200} 
          className="sm:!h-[300px] md:!h-[350px] lg:!h-[400px]"
          >
  <BarChart
        data={graphData}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        // className="mt-10 mr-0 m-20 mb-20"
      >
   <XAxis dataKey="month" className="text-xs md:text-sm" />
        <YAxis className="text-[10px] md:text-sm" />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
              {renderTransactionCard(
                "Purchase",
                "Purchase",
                formatCurrencyCompact(transactionStats.purchaseAmount || 0),
                transactionStats.purchasePct || "—"
              )}
            </div>
            <div>
              {renderTransactionCard(
                "Expense",
                "Expense",
                formatCurrencyCompact(transactionStats.expenseAmount || 0),
                transactionStats.expensePct || "—"
              )}
            </div>
            <div>
              {renderTransactionCard(
                "Collection",
                "Collection Calls",
                String(transactionStats.collectionCount || 0),
                transactionStats.collectionPct || "—"
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
          {/* <button
            onClick={() => setSelectedType("All")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button> */}
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
<td className="p-5 flex gap-3 text-[20px] text-gray-600">
  {/* 📞 Phone */}
  <a href={`tel:${txn.contact}`}>
    <FaPhoneAlt className="cursor-pointer hover:text-green-600 text-[#2563EB]" />
  </a>

  {/* 💬 WhatsApp */}
  <a
    href={`https://wa.me/${txn.contact}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaWhatsapp className="cursor-pointer hover:text-green-500 text-[#60D669]" />
  </a>

  {/* 📧 Email */}
  <a href={`mailto:${txn.email || "demo@example.com"}`}>
    <FaEnvelope className="cursor-pointer hover:text-blue-500 text-[#2563EB]" />
  </a>
</td>

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

      {/* <div className="w-full justify-center flex py-10">
        <div className="bg-[#EB2525] px-6 py-4 rounded-full text-white flex gap-5 shadow-md">
          <FaPlus /> Add Button
        </div>
      </div> */}
    </div>
  );
};

export default D1DashboardHome;
