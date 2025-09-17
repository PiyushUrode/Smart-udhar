import React, { useState, useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
import { CSVLink } from 'react-csv';
import { Search, Edit2, Trash2, Download, Users2 } from 'lucide-react';
import dayjs from 'dayjs';

const initialData = [
  { date: '2025-01-01', customerCount: 120, retention: 75 },
  { date: '2025-02-01', customerCount: 135, retention: 78 },
  { date: '2025-03-01', customerCount: 128, retention: 74 },
  { date: '2025-04-01', customerCount: 142, retention: 80 },
  { date: '2025-05-01', customerCount: 155, retention: 82 },
  { date: '2025-06-01', customerCount: 148, retention: 79 },
];

const T5TotalInvoice = () => {
  const [records, setRecords] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [minRetention, setMinRetention] = useState('');
  const [maxRetention, setMaxRetention] = useState('');

  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        if (searchText) {
          const dt = dayjs(r.date).format('YYYY-MM-DD');
          return (
            dt.includes(searchText) ||
            r.customerCount.toString().includes(searchText)
          );
        }
        return true;
      })
      .filter((r) => {
        if (minRetention !== '' && r.retention < parseFloat(minRetention)) return false;
        if (maxRetention !== '' && r.retention > parseFloat(maxRetention)) return false;
        return true;
      });
  }, [records, searchText, minRetention, maxRetention]);

  const totalCustomers = useMemo(
    () => records.reduce((sum, r) => sum + r.customerCount, 0),
    [records]
  );
  const avgRetention = useMemo(
    () =>
      records.length
        ? (
            records.reduce((sum, r) => sum + r.retention, 0) / records.length
          ).toFixed(1)
        : '0.0',
    [records]
  );

  const handleEdit = (idx) => {
    alert(`Edit placeholder for record ${idx}`);
  };
  const handleDelete = (idx) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  };

  // Chart setup: dual axis
  const chartOptions = {
    chart: {
      id: 'customer-retention',
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    stroke: { curve: 'smooth', width: [3, 3] },
    yaxis: [
      {
        title: { text: 'Customer Count' },
        labels: {
          formatter: (val) => `${Math.round(val)}`,
        },
      },
      {
        opposite: true,
        title: { text: 'Retention (%)' },
        labels: {
          formatter: (val) => `${val.toFixed(1)}%`,
        },
      },
    ],
    xaxis: {
      categories: records.map((r) => dayjs(r.date).format('MMM YYYY')),
      labels: { rotate: -45 },
    },
    tooltip: {
      shared: true,
      y: [
        {
          formatter: (v) => `${v} customers`,
        },
        {
          formatter: (v) => `${v.toFixed(1)}%`,
        },
      ],
    },
    legend: { position: 'top' },
    dataLabels: { enabled: false },
    colors: ['#2563EB', '#9333EA'],
  };

  const series = [
    {
      name: 'Customer Count',
      type: 'column',
      data: records.map((r) => r.customerCount),
    },
    {
      name: 'Retention Rate',
      type: 'line',
      data: records.map((r) => r.retention),
    },
  ];

  return (
    <div className="p-6 bg-[#F5F7FA] min-h-screen font-interR">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-interSb bg-clip-text text-transparent bg-gradient-to-r from-bluecol to-purple-600 flex items-center gap-2">
           Total Invoice History
            </h1>

          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <input
                placeholder="Search date or count"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-3 py-2 border-2 bg-white rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-bluecol"
              />
              <Search className="absolute top-2 left-3 text-gray-400" size={16} />
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Retention %"
                value={minRetention}
                onChange={(e) => setMinRetention(e.target.value)}
                className="w-28 px-2 py-2 border-2 bg-white rounded-md text-sm focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max Retention %"
                value={maxRetention}
                onChange={(e) => setMaxRetention(e.target.value)}
                className="w-28 px-2 py-2 border-2 bg-white rounded-md text-sm focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <CSVLink
                data={filtered.map((r) => ({
                  Date: dayjs(r.date).format('YYYY-MM-DD'),
                  CustomerCount: r.customerCount,
                  RetentionRate: `${r.retention.toFixed(1)}%`,
                }))}
                filename="total-invoice-history.csv"
                className="flex items-center gap-1 bg-bluecol text-white px-4 py-2 rounded-md text-sm"
              >
                <Download size={16} /> Export CSV
              </CSVLink>
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
                <Download size={16} /> PDF
              </button>
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-customCard p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-interSb">Customer & Retention Trend</h3>
          </div>
          <ApexCharts options={chartOptions} series={series} type="line" height={300} />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Total Customer Entries</div>
            <div className="text-xl font-interSb">{records.length}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Aggregate Customers</div>
            <div className="text-xl font-interSb">{totalCustomers.toLocaleString()}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Avg Retention</div>
            <div className="text-xl font-interSb">{avgRetention}%</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-customCard p-5 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-interSb">Invoice / Customer Records</h4>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#F6F8FA] text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-right px-4 py-2">Customer Count</th>
                <th className="text-right px-4 py-2">Retention Rate (%)</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{dayjs(row.date).format('YYYY-MM-DD')}</td>
                  <td className="px-4 py-3 text-right">{row.customerCount}</td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      row.retention >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {row.retention.toFixed(1)}%
                  </td>
                  <td className="text-center px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Edit2 size={16} className="text-bluecol" />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
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
  );
};

export default T5TotalInvoice;
