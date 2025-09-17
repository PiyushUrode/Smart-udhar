import React, { useState, useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
import { CSVLink } from 'react-csv';
import { Search, Edit2, Trash2, Download } from 'lucide-react';
import dayjs from 'dayjs';

const initialPayments = [
  { date: '2025-03-01', amount: 50000, method: 'Credit Card' },
  { date: '2025-03-01', amount: 30000, method: 'UPI' },
  { date: '2025-03-01', amount: 20000, method: 'Wallet' },
  { date: '2025-04-01', amount: 60000, method: 'Credit Card' },
  { date: '2025-04-01', amount: 25000, method: 'UPI' },
  { date: '2025-04-01', amount: 15000, method: 'Wallet' },
  { date: '2025-05-01', amount: 70000, method: 'Credit Card' },
  { date: '2025-05-01', amount: 40000, method: 'UPI' },
  { date: '2025-05-01', amount: 10000, method: 'Wallet' },
  { date: '2025-06-01', amount: 55000, method: 'Credit Card' },
  { date: '2025-06-01', amount: 35000, method: 'UPI' },
  { date: '2025-06-01', amount: 12000, method: 'Wallet' },
];

const paymentMethods = ['Credit Card', 'UPI', 'Wallet'];

const T2TotalPaid = () => {
  const [records, setRecords] = useState(initialPayments);
  const [searchText, setSearchText] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // Filtered list
  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        if (searchText) {
          const dt = dayjs(r.date).format('YYYY-MM-DD');
          return (
            dt.includes(searchText) ||
            r.amount.toString().includes(searchText) ||
            r.method.toLowerCase().includes(searchText.toLowerCase())
          );
        }
        return true;
      })
      .filter((r) => {
        if (methodFilter) {
          return r.method === methodFilter;
        }
        return true;
      });
  }, [records, searchText, methodFilter]);

  // Aggregation for chart: group by month, sum per method
  const aggregated = useMemo(() => {
    const months = Array.from(
      new Set(records.map((r) => dayjs(r.date).format('MMM YYYY')))
    );
    const series = paymentMethods.map((method) => {
      return {
        name: method,
        data: months.map((m) => {
          // sum amounts for this month and method
          return records
            .filter(
              (r) =>
                dayjs(r.date).format('MMM YYYY') === m &&
                r.method === method
            )
            .reduce((sum, r) => sum + r.amount, 0);
        }),
      };
    });
    return { months, series };
  }, [records]);

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: aggregated.months,
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
    },
    legend: {
      position: 'top',
    },
    dataLabels: { enabled: false },
    fill: {
      opacity: 1,
    },
  };

  // Summary
  const totalPaid = useMemo(
    () => records.reduce((sum, r) => sum + r.amount, 0),
    [records]
  );
  const latestMonth = aggregated.months[aggregated.months.length - 1] || '';
  const latestTotal = useMemo(() => {
    if (!latestMonth) return 0;
    return paymentMethods
      .map((method) =>
        records
          .filter(
            (r) =>
              dayjs(r.date).format('MMM YYYY') === latestMonth &&
              r.method === method
          )
          .reduce((s, r) => s + r.amount, 0)
      )
      .reduce((a, b) => a + b, 0);
  }, [records, latestMonth]);

  // Edit / Delete
  const handleDelete = (idx) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleEdit = (idx) => {
    alert('Edit functionality placeholder for record index ' + idx);
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto font-interR space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-interSb bg-clip-text text-transparent bg-gradient-to-r from-bluecol to-purple-600">
              Total Paid History
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Paid amounts broken down by payment method over time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <input
                placeholder="Search date, amount, method"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-3 py-2 border-2 bg-white  rounded-md text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-bluecol"
              />
              <Search className="absolute top-2 left-3 text-gray-400" size={16} />
            </div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="border-2 bg-white px-3 py-2 rounded-md text-sm"
            >
              <option value="">All Methods</option>
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <CSVLink
                data={filtered.map((r) => ({
                  Date: dayjs(r.date).format('YYYY-MM-DD'),
                  Amount: r.amount,
                  Method: r.method,
                }))}
                filename="total-paid.csv"
                className="flex items-center gap-1 bg-bluecol text-white px-4 py-2 rounded-md text-sm"
              >
                <Download size={16} /> Export CSV
              </CSVLink>
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
                <Download size={16} /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-customCard p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-interSb flex items-center gap-2">
              <Download size={18} /> Paid Amounts by Method
            </h3>
          </div>
          <ApexCharts
            options={chartOptions}
            series={aggregated.series}
            type="bar"
            height={300}
          />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Total Paid</div>
            <div className="text-xl font-interSb">₹{totalPaid.toLocaleString()}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Latest Month</div>
            <div className="text-xl font-interSb">{latestMonth || '—'}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Latest Paid</div>
            <div className="text-xl font-interSb">
              ₹{latestTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-customCard p-5 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-interSb">Payment Records</h4>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#F6F8FA] text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-right px-4 py-2">Amount (₹)</th>
                <th className="text-left px-4 py-2">Method</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{dayjs(row.date).format('YYYY-MM-DD')}</td>
                  <td className="px-4 py-3 text-right">
                    ₹{row.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{row.method}</td>
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
                    No matching records.
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

export default T2TotalPaid;
