import React, { useState, useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
import { CSVLink } from 'react-csv';
import {
  Search,
  Edit2,
  Trash2,
  Download,
  Box,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import dayjs from 'dayjs';

// Dummy initial data; replace with backend fetch
const initialData = [
  { date: '2025-01-01', productCount: 500, lowStock: 20 },
  { date: '2025-02-01', productCount: 520, lowStock: 15 },
  { date: '2025-03-01', productCount: 510, lowStock: 40 },
  { date: '2025-04-01', productCount: 530, lowStock: 10 },
  { date: '2025-05-01', productCount: 550, lowStock: 5 },
  { date: '2025-06-01', productCount: 540, lowStock: 30 },
];

const LOW_STOCK_THRESHOLD = 25;

const T6TotalPackage = () => {
  const [records, setRecords] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  // Filter logic
  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        if (!searchText) return true;
        const dateStr = dayjs(r.date).format('YYYY-MM-DD');
        return (
          dateStr.includes(searchText) ||
          r.productCount.toString().includes(searchText) ||
          r.lowStock.toString().includes(searchText)
        );
      })
      .filter((r) => {
        if (showOnlyLowStock) {
          return r.lowStock >= LOW_STOCK_THRESHOLD;
        }
        return true;
      });
  }, [records, searchText, showOnlyLowStock]);

  // Summary
  const totalProducts = useMemo(
    () => records.reduce((sum, r) => sum + r.productCount, 0),
    [records]
  );
  const totalLowStock = useMemo(
    () => records.reduce((sum, r) => sum + r.lowStock, 0),
    [records]
  );
  const latest = records[records.length - 1] || {};

  // Chart config
  const chartOptions = {
    chart: {
      id: 'package-trend',
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '40%',
      },
    },
    stroke: { curve: 'smooth', width: [0, 0] },
    xaxis: {
      categories: records.map((r) => dayjs(r.date).format('MMM YYYY')),
      labels: { style: { fontSize: '12px' } },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => val.toLocaleString(),
      },
      style: { fontSize: '13px' },
    },
    legend: { position: 'top', horizontalAlign: 'right' },
    colors: ['#2563EB', '#F59E0B'],
    dataLabels: { enabled: false },
    grid: {
      strokeDashArray: 4,
    },
  };

  const chartSeries = [
    {
      name: 'Product Count',
      type: 'bar',
      data: records.map((r) => r.productCount),
    },
    {
      name: 'Low Stock',
      type: 'bar',
      data: records.map((r) => r.lowStock),
    },
  ];

  // Handlers (to be connected to backend)
  const handleEdit = (idx) => {
    // placeholder: open edit form
    alert(`Edit record at index ${idx}`);
  };
  const handleDelete = (idx) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F0F4FA] py-8 px-4 sm:px-6 lg:px-8 font-interR">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-interSb text-gray-900 flex items-center gap-3">

              <span className="bg-clip-text text-transparent bg-gradient-to-r from-bluecol to-purple-600">
                Total Package History
              </span>
            </h1>

          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-auto">
              <input
                aria-label="Search"
                placeholder="Search by date / count"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border-2 bg-white border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-bluecol shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <button
              onClick={() => setShowOnlyLowStock((s) => !s)}
              className="flex items-center gap-1 text-sm px-4 py-2 rounded-md border shadow-sm hover:bg-gray-50 transition"
            >
              {showOnlyLowStock ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="font-medium">
                {showOnlyLowStock ? 'Only Low Stock' : 'Highlight Low Stock'}
              </span>
            </button>

            <div className="flex flex-wrap gap-2">
              <CSVLink
                data={filtered.map((r) => ({
                  Date: dayjs(r.date).format('YYYY-MM-DD'),
                  ProductCount: r.productCount,
                  LowStock: r.lowStock,
                }))}
                filename="total-package-history.csv"
                className="flex items-center gap-1 bg-bluecol text-white px-4 py-2 rounded-md text-sm font-robotoM shadow"
              >
                <Download size={16} /> Export CSV
              </CSVLink>
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition">
                <Download size={16} /> PDF
              </button>
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition">
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-2xl shadow-customCard p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-interSb text-gray-800 flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-600" />
                Product vs Low Stock Trend
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              Trends over months. Hover to see exact values.
            </div>
          </div>
          <div className="w-full">
            <ApexCharts options={chartOptions} series={chartSeries} type="bar" height={320} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col gap-2">
            <div className="text-xs uppercase font-interSb text-gray-500 tracking-wide">
              Total Entries
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-interSb text-gray-900">{records.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col gap-2">
            <div className="text-xs uppercase font-interSb text-gray-500 tracking-wide">
              Aggregate Products
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-interSb text-gray-900">
                {totalProducts.toLocaleString?.() || totalProducts}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col gap-2">
            <div className="text-xs uppercase font-interSb text-gray-500 tracking-wide">
              Aggregate Low Stock
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-interSb text-gray-900">
                {totalLowStock.toLocaleString?.() || totalLowStock}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col gap-2">
            <div className="text-xs uppercase font-interSb text-gray-500 tracking-wide">
              Latest Date
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-interSb text-gray-900">
                {latest.date ? dayjs(latest.date).format('YYYY-MM-DD') : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-customCard p-6 overflow-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-interSb text-gray-800">Package Records</h3>
              <p className="text-sm text-gray-500 mt-1">
                Filtered view of historical product/low-stock ratios. Edit or delete entries as needed.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#F6F8FA] text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-interSb">Date</th>
                  <th className="text-right px-5 py-3 font-interSb">Product Count</th>
                  <th className="text-right px-5 py-3 font-interSb">Low Stock</th>
                  <th className="text-center px-5 py-3 font-interSb">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const isLowStock = row.lowStock >= LOW_STOCK_THRESHOLD;
                  return (
                    <tr
                      key={idx}
                      className={`transition ${
                        showOnlyLowStock
                          ? ''
                          : isLowStock
                          ? 'bg-[#FEF3C7]'
                          : 'hover:bg-gray-50'
                      } border-b last:border-b-0`}
                    >
                      <td className="px-5 py-4">{dayjs(row.date).format('YYYY-MM-DD')}</td>
                      <td className="px-5 py-4 text-right font-medium text-gray-800">
                        {row.productCount}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-interSb rounded-full ${
                            isLowStock
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {row.lowStock}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="p-2 rounded hover:bg-gray-100 transition"
                        >
                          <Edit2 size={16} className="text-bluecol" />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-2 rounded hover:bg-gray-100 transition"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default T6TotalPackage;
