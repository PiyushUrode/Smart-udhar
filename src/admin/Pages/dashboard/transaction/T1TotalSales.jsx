import React, { useState, useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
import { CSVLink } from 'react-csv';
import { Search, Edit2, Trash2, FileText, Download } from 'lucide-react';
import dayjs from 'dayjs';

const initialData = [
  { date: '2025-01-01', revenue: 120000, pctChange: 0 },
  { date: '2025-02-01', revenue: 135000, pctChange: ((135000 - 120000) / 120000) * 100 },
  { date: '2025-03-01', revenue: 128000, pctChange: ((128000 - 135000) / 135000) * 100 },
  { date: '2025-04-01', revenue: 142000, pctChange: ((142000 - 128000) / 128000) * 100 },
  { date: '2025-05-01', revenue: 155000, pctChange: ((155000 - 142000) / 142000) * 100 },
];

const computePctChange = (prev, curr) =>
  prev ? ((curr - prev) / prev) * 100 : 0;

const T1TotalSales = () => {
  const [data, setData] = useState(
    initialData.map((d, i) => ({
      ...d,
      pctChange: i === 0 ? 0 : computePctChange(initialData[i - 1].revenue, d.revenue),
    }))
  );
  const [searchText, setSearchText] = useState('');
  const [minPct, setMinPct] = useState('');
  const [maxPct, setMaxPct] = useState('');
  const [form, setForm] = useState({ date: '', revenue: '', pctChange: '' });
  const [editingIdx, setEditingIdx] = useState(null);

  // Filtered list
  const filtered = useMemo(() => {
    return data
      .filter((d) => {
        if (searchText) {
          const dt = dayjs(d.date).format('YYYY-MM-DD');
          return (
            dt.includes(searchText) ||
            d.revenue.toString().includes(searchText)
          );
        }
        return true;
      })
      .filter((d) => {
        if (minPct !== '' && d.pctChange < parseFloat(minPct)) return false;
        if (maxPct !== '' && d.pctChange > parseFloat(maxPct)) return false;
        return true;
      });
  }, [data, searchText, minPct, maxPct]);

  // Chart config
  const chartOptions = {
    chart: {
      id: 'revenue-trend',
      toolbar: { show: true },
      zoom: { enabled: true },
      animations: { enabled: true },
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: data.map((d) => dayjs(d.date).format('MMM YYYY')),
      labels: { rotate: -45 },
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
    },
    markers: { size: 5 },
    dataLabels: { enabled: false },
    yaxis: {
      labels: {
        formatter: (val) => `₹${(val / 1000).toFixed(0)}k`,
      },
    },
    annotations: {
      yaxis: filtered.map((d) => ({
        y: d.revenue,
        borderColor: '#2563EB',
        label: {
          text: `${d.pctChange >= 0 ? '+' : ''}${d.pctChange.toFixed(1)}%`,
          style: { background: '#2563EB', color: '#fff' },
        },
      })),
    },
  };
  const chartSeries = [
    {
      name: 'Revenue',
      data: data.map((d) => d.revenue),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.revenue) return;
    const revenueNum = parseFloat(form.revenue);
    let newData = [...data];
    if (editingIdx !== null) {
      newData[editingIdx] = {
        date: form.date,
        revenue: revenueNum,
        pctChange:
          editingIdx === 0
            ? 0
            : computePctChange(newData[editingIdx - 1].revenue, revenueNum),
      };
      // recalc subsequent pctChange
      for (let i = editingIdx + 1; i < newData.length; i++) {
        newData[i].pctChange = computePctChange(
          newData[i - 1].revenue,
          newData[i].revenue
        );
      }
      setEditingIdx(null);
    } else {
      const last = newData[newData.length - 1];
      const newPct = last
        ? computePctChange(last.revenue, revenueNum)
        : 0;
      newData.push({ date: form.date, revenue: revenueNum, pctChange: newPct });
    }
    setData(newData);
    setForm({ date: '', revenue: '', pctChange: '' });
  };

  const handleEdit = (idx) => {
    const item = data[idx];
    setForm({ date: item.date, revenue: item.revenue.toString(), pctChange: item.pctChange.toFixed(1) });
    setEditingIdx(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (idx) => {
    const copy = data.filter((_, i) => i !== idx);
    // recompute pctChange chain
    const recomputed = copy.map((d, i) => ({
      ...d,
      pctChange: i === 0 ? 0 : computePctChange(copy[i - 1].revenue, d.revenue),
    }));
    setData(recomputed);
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto font-interR space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-interSb bg-clip-text text-transparent bg-gradient-to-r from-bluecol to-purple-600">
              Total Sales History
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Revenue trends with comparison to previous months. Add / edit entries below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <input
                placeholder="Search date or revenue"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-3 py-2 border-2 rounded-md text-sm w-full md:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-bluecol"
              />
              <Search className="absolute top-2 left-3 text-gray-400" size={16} />
            </div>
            <div className="flex gap-2">
              <input
                type="string"
                placeholder="Min %"
                value={minPct}
                onChange={(e) => setMinPct(e.target.value)}
                className="w-20 px-2 py-2 bg-white  border-2 rounded-md text-sm focus:outline-none"
              />
              <input
                type="string"
                placeholder="Max %"
                value={maxPct}
                onChange={(e) => setMaxPct(e.target.value)}
                className="w-20 px-2 py-2 border-2 bg-white rounded-md text-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <CSVLink
                data={filtered.map((d) => ({
                  Date: dayjs(d.date).format('YYYY-MM-DD'),
                  Revenue: d.revenue,
                  PercentageChange: d.pctChange.toFixed(2),
                }))}
                filename="total-sales.csv"
                className="flex items-center gap-1 bg-bluecol text-white px-4 py-2 rounded-md text-sm"
              >
                <Download size={16} /> Export CSV
              </CSVLink>
              {/* placeholders for others */}
              <button className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
                <FileText size={16} /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-customCard p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-interSb">Revenue Trend</h3>
          </div>
          <ApexCharts options={chartOptions} series={chartSeries} type="line" height={280} />
        </div>

        {/* Form + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-customCard p-5">
            <h4 className="text-md font-interSb mb-3">Add / Edit Entry</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border-2 bg-white rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Revenue (₹)</label>
                <input
                  type="string"
                  value={form.revenue}
                  onChange={(e) => setForm((f) => ({ ...f, revenue: e.target.value }))}
                  className="w-full border-2 bg-white rounded px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Percentage Change (auto if blank)
                </label>
                <input
                  type="string"
                  value={form.pctChange}
                  onChange={(e) => setForm((f) => ({ ...f, pctChange: e.target.value }))}
                  className="w-full border-2 bg-white rounded px-3 py-2 text-sm"
                  placeholder="Optional"
                  disabled={editingIdx === null ? false : false}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-bluecol text-white py-2 rounded-md font-interSb"
              >
                {editingIdx !== null ? 'Update Entry' : 'Add Entry'}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-customCard p-5 overflow-auto">
            <h4 className="text-md font-interSb mb-3">Sales Records</h4>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-[#F6F8FA] text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-right px-4 py-2">Revenue (₹)</th>
                    <th className="text-right px-4 py-2">% Change</th>
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
                        ₹{row.revenue.toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium ${
                          row.pctChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {row.pctChange >= 0 ? '+' : ''}
                        {row.pctChange.toFixed(1)}%
                      </td>
                      <td className="text-center px-4 py-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(data.indexOf(row))}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Edit2 size={16} className="text-bluecol" />
                        </button>
                        <button
                          onClick={() => handleDelete(data.indexOf(row))}
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

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-customCard p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Total Months</div>
            <div className="text-xl font-interSb">{data.length}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Latest Revenue</div>
            <div className="text-xl font-interSb">
              ₹{data[data.length - 1].revenue.toLocaleString()}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">Change vs Prev</div>
            <div
              className={`text-xl font-interSb ${
                data[data.length - 1].pctChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {data[data.length - 1].pctChange >= 0 ? '+' : ''}
              {data[data.length - 1].pctChange.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default T1TotalSales;
