// Smart Udhar Dashboard - API Integrated (Dynamic & Improved)

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Wallet,
  CreditCard,
  Store,
  Users,
  Package,
  Activity,
  Smile,
  BadgeDollarSign,
} from "lucide-react";

import ApexCharts from "react-apexcharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { CSVLink } from "react-csv";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN; // 🔑 safer than hardcoding

// === Chart Configurations ===
const monthlyRevenueOptions = {
  chart: { type: "line", zoom: { enabled: true }, toolbar: { show: true } },
  stroke: { curve: "smooth" },
  tooltip: { shared: true, intersect: false },
};

// === Static Maps ===
const STAT_CARD_TYPE_MAP = {
  sale: { icon: <ShoppingCart size={20} color="#16A34A" />, bg: "bg-[#DCFCE7]" },
  paid: { icon: <Wallet size={20} color="#2563EB" />, bg: "bg-[#DBEAFE]" },
  pending: { icon: <CreditCard size={20} color="#EA580C" />, bg: "bg-[#FFEDD5]" },
  stores: { icon: <Store size={20} color="#8B5CF6" />, bg: "bg-[#EDE9FE]" },
  customers: { icon: <Users size={20} color="#10B981" />, bg: "bg-[#D1FAE5]" },
  products: { icon: <Package size={20} color="#F59E0B" />, bg: "bg-[#FEF3C7]" },
  active: { icon: <Activity size={20} color="#3B82F6" />, bg: "bg-[#DBEAFE]" },
  satisfaction: { icon: <Smile size={20} color="#FBBF24" />, bg: "bg-[#FEF9C3]" },
  subscription: { icon: <BadgeDollarSign size={20} color="#0EA5E9" />, bg: "bg-[#E0F2FE]" },
};

// === Components ===
const StatCard = ({ title, value, change, isPositive, type }) => {
  const config = STAT_CARD_TYPE_MAP[type] || {};
  return (
    <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center w-full">
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-xl font-semibold text-black">{value}</div>
        {change !== undefined && (
          <div
            className={`text-sm flex items-center gap-1 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? <FaArrowUp /> : <FaArrowDown />} {change}%
          </div>
        )}
      </div>
      <div className={`p-2 rounded-full shadow ${config.bg}`}>{config.icon}</div>
    </div>
  );
};

const ActivityItem = ({ text, time }) => (
  <div className="text-sm py-2 border-b">
    <div>{text}</div>
    <div className="text-xs text-gray-400">{time}</div>
  </div>
);

// === Utility ===
const formatCurrency = (val) =>
  `₹${(val || 0).toLocaleString("en-IN")}`;

const percentChange = (currentVal, prevVal) => {
  if (!prevVal || prevVal === 0) return 0;
  return Number((((currentVal - prevVal) / prevVal) * 100).toFixed(1));
};

// === Main Dashboard ===
const D1DashboardHome = () => {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [monthlyRevenueSeries, setMonthlyRevenueSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const year = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // 1-12

        const months = Array.from({ length: currentMonth }, (_, i) => i + 1);

        // Fetch only till current month
        const responses = await Promise.all(
          months.map((month) =>
            axios.get(
              `${API_URL}/admin/dashboard-export?year=${year}&month=${month}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${API_TOKEN}`,
                },
              }
            )
          )
        );

        const MONTH_NAMES = [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec",
        ];

        const chartData = responses.map((res, idx) => {
          const data = res.data;
          return {
            month: MONTH_NAMES[idx],
            sales: Math.ceil(data.totalSum) || 0,
            paid: Math.ceil(data.paidSum) || 0,
            pending: Math.ceil(data.pendingSum) || 0,
          };
        });

        // Last month & current month for percentage change
        const current = responses[responses.length - 1]?.data;
        const previous =
          responses.length > 1 ? responses[responses.length - 2]?.data : null;

        if (current?.status === "success") {
          setStats({
            totalSum: Math.floor(current.totalSum),
            totalSumChange: percentChange(
              current.totalSum,
              previous?.totalSum
            ),
            paidSum: Math.floor(current.paidSum),
            paidSumChange: percentChange(
              current.paidSum,
              previous?.paidSum
            ),
            pendingSum: Math.floor(current.pendingSum),
            pendingSumChange: percentChange(
              current.pendingSum,
              previous?.pendingSum
            ),
            storecount: current.storecount,
            customerCount: current.customerCount,
            productCount: current.productCount,
          });
        }

        // Keep only last 6 months in chart
        const last6 = chartData.slice(-6);

        setGraphData(last6);
        setMonthlyRevenueSeries([
          { name: "Sales", data: last6.map((d) => d.sales) },
          { name: "Paid", data: last6.map((d) => d.paid) },
          { name: "Pending", data: last6.map((d) => d.pending) },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activityFeed = [
    { type: "sale", text: "New sale recorded", time: "5 min ago" },
    { type: "admin", text: "Admin updated store details", time: "10 min ago" },
    { type: "paid", text: "Payment received", time: "20 min ago" },
  ];

  if (loading) {
    return (
      <div className="p-4 pt-10 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-10 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="p-4 pt-10 space-y-6">
      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="OverAll Monthly Sales"
            value={formatCurrency(stats.totalSum)}
            change={stats.totalSumChange}
            isPositive={stats.totalSumChange >= 0}
            type="sale"
          />
          <StatCard
            title="OverAll Monthly Paid"
            value={formatCurrency(stats.paidSum)}
            change={stats.paidSumChange}
            isPositive={stats.paidSumChange >= 0}
            type="paid"
          />
          <StatCard
            title="OverAll Monthly Pending"
            value={formatCurrency(stats.pendingSum)}
            change={stats.pendingSumChange}
            isPositive={stats.pendingSumChange < 0} // ✅ less pending is good
            type="pending"
          />
          <StatCard title="OverAll Users" value={stats.storecount} type="stores" />
          <StatCard
            title="OverAll User's Customers"
            value={stats.customerCount}
            type="customers"
          />
          <StatCard
            title="OverAll Products"
            value={stats.productCount}
            type="products"
          />
        </div>
      )}

      {/* Monthly Revenue Trends - Line Chart */}
      <div className="bg-white p-4 shadow rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">
            Last 6 Months - Sales, Paid, Pending
          </h2>
          <CSVLink
            data={graphData}
            filename="monthly-progress.csv"
            className="text-sm text-blue-600"
          >
            Download CSV
          </CSVLink>
        </div>
        <ApexCharts
          options={{
            ...monthlyRevenueOptions,
            xaxis: { categories: graphData.map((d) => d.month) },
          }}
          series={monthlyRevenueSeries}
          type="line"
          height={320}
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {activityFeed.map((item, idx) => (
            <ActivityItem key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default D1DashboardHome;
