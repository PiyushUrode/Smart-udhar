// D1DashboardController.js
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useDashboardController = () => {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [monthlyRevenueSeries, setMonthlyRevenueSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (val) => `₹${(val || 0).toLocaleString("en-IN")}`;
  const percentChange = (currentVal, prevVal) => {
    if (!prevVal || prevVal === 0) return 0;
    return Number((((currentVal - prevVal) / prevVal) * 100).toFixed(1));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const year = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const months = Array.from({ length: currentMonth }, (_, i) => i + 1);

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

        const current = responses[responses.length - 1]?.data;
        const previous =
          responses.length > 1 ? responses[responses.length - 2]?.data : null;

        if (current?.status === "success") {
          setStats({
            totalSum: Math.floor(current.totalSum),
            totalSumChange: percentChange(current.totalSum, previous?.totalSum),
            paidSum: Math.floor(current.paidSum),
            paidSumChange: percentChange(current.paidSum, previous?.paidSum),
            pendingSum: Math.floor(current.pendingSum),
            pendingSumChange: percentChange(current.pendingSum, previous?.pendingSum),
            storecount: current.storecount,
            customerCount: current.customerCount,
            productCount: current.productCount,
          });
        }

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

  return {
    stats,
    graphData,
    monthlyRevenueSeries,
    loading,
    error,
    activityFeed,
    formatCurrency,
  };
};

export default useDashboardController;
