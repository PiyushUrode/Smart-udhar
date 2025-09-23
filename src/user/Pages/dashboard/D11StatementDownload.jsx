import React, { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Users,
  Wallet,
  Receipt,
  BookOpenCheck,
  Clock,
  CalendarClock,
  ChevronDown,
} from "lucide-react";
import { FaQuestion } from "react-icons/fa";
import ReportService from "../../api/statementdownload.js";

const reports = [
  {
    title: "Sales Report",
    desc: "Daily, weekly, or monthly summaries of total sales performance and revenue tracking.",
    formats: ["PDF", "Excel"],
    color: "green",
    icon: <BookOpenCheck className="text-green-600" />,
    hasFilter: true,
  },
  {
    title: "Credit Report",
    desc: "Complete list of all customers with outstanding payments and credit details.",
    formats: ["PDF", "Excel"],
    color: "blue",
    icon: <Users className="text-blue-600" />,
    hasFilter: true,
  },
  {
    title: "Product Report",
    desc: "Track all Product you’ve made or received with detailed transaction history.",
    formats: ["PDF", "Excel"],
    color: "red",
    icon: <Wallet className="text-red-600" />,
    hasFilter: true,
  },
  {
    title: "Expense Report",
    desc: "Categorized list of business expenses with GST and Non-GST classifications.",
    formats: ["PDF", "Excel"],
    color: "purple",
    icon: <Receipt className="text-purple-600" />,
    hasFilter: true,
  },
  {
    title: "Pending Amount Summary",
    desc: "Complete overview of all outstanding dues and follow-ups requiring attention.",
    formats: ["PDF", "Excel"],
    color: "yellow",
    icon: <Clock className="text-yellow-600" />,
  },
  {
    title: "Custom Date Range",
    desc: "Download reports for any specific time period with flexible date filtering.",
    formats: ["Set"],
    color: "indigo",
    icon: <CalendarClock className="text-indigo-600" />,
  },
];

const reportApiMap = {
  "Sales Report": "store-sales",
  "Credit Report": "store-credit",
  "Product Report": "store-product",
  "Expense Report": "store-expense",
  "Pending Amount Summary": "store-pending",
  "Custom Date Range": "store-custom",
};

const formatIcons = {
  PDF: <FileText className="w-4 h-4 mr-1" />,
  Excel: <FileSpreadsheet className="w-4 h-4 mr-1" />,
  Set: <Download className="w-4 h-4 mr-1" />,
};

const colorClassMap = {
  green: "bg-green-600 text-white",
  blue: "bg-blue-600 text-white",
  red: "bg-red-600 text-white",
  purple: "bg-purple-600 text-white",
  yellow: "bg-yellow-500 text-white",
  indigo: "bg-indigo-600 text-white",
};

const filterOptions = ["Daily", "Weekly", "Monthly"];

const D11StatementDownload = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dateRange] = useState({
    startDate: "2025-01-01",
    endDate: new Date().toISOString().split("T")[0],
  });

  const toggleFilter = (index) => {
    setActiveFilter(activeFilter === index ? null : index);
  };

  const selectFilter = (index, option) => {
    setSelectedFilters((prev) => ({ ...prev, [index]: option }));
    setActiveFilter(null);
  };

  const handleDownload = async (report, format) => {
    const apiName = reportApiMap[report.title];
    const filter = selectedFilters[report.title] || null;
    await ReportService.exportReport(
      apiName,
      format.toLowerCase(),
      dateRange.startDate,
      dateRange.endDate,
      filter
    );
  };

  return (
    <div className="py-5 sm:py-7 lg:py-14 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-[#2563EB] border py-10 border-blue-300 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-white">
            Download Comprehensive Business Reports
          </h2>
          <p className="text-sm text-white mt-1 max-w-2xl">
            Generate detailed reports for tax filing, audits, business planning,
            and partner sharing. Available in PDF and Excel formats.
          </p>
        </div>
        <div className="border-4 border-dotted w-fit rounded-full p-3">
          <FaQuestion color="white" />
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="relative bg-white shadow rounded-lg p-4 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    {report.icon}
                  </div>
                  <h4 className="font-semibold text-md text-gray-800">
                    {report.title}
                  </h4>
                </div>
                {report.hasFilter && (
                  <div className="relative">
                    <button
                      onClick={() => toggleFilter(index)}
                      className="text-sm flex items-center text-gray-600 hover:text-black"
                    >
                      {selectedFilters[report.title] || "Filters"}{" "}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>

                    {activeFilter === index && (
                      <div className="absolute top-5 right-0 z-10 bg-white border border-gray-200 rounded shadow-lg w-32">
                        {filterOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => selectFilter(report.title, option)}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
<div className="flex flex-wrap gap-2">
  {report.title === "Product Report" ? (
    <>
      <span
        onClick={() => ReportService.exportProductsExcel()}
        className={`cursor-pointer text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${colorClassMap[report.color]}`}
      >
        {formatIcons.Excel} Excel
      </span>
      <span
        onClick={() => ReportService.exportProductsPDF()}
        className={`cursor-pointer text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${colorClassMap[report.color]}`}
      >
        {formatIcons.PDF} PDF
      </span>
    </>
  ) : report.title === "Credit Report" ? (
    <>
      <span
        onClick={() => ReportService.exportCustomersToExcel()}
        className={`cursor-pointer text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${colorClassMap[report.color]}`}
      >
        {formatIcons.Excel} Excel
      </span>
      <span
        onClick={() => ReportService.exportCustomersToPDF()}
        className={`cursor-pointer text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${colorClassMap[report.color]}`}
      >
        {formatIcons.PDF} PDF
      </span>
    </>
  ) : (
    report.formats.map((format) => (
      <span
        key={format}
        onClick={() => handleDownload(report, format)}
        className={`cursor-pointer text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${colorClassMap[report.color]}`}
      >
        {formatIcons[format]} {format}
      </span>
    ))
  )}
</div>




            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default D11StatementDownload;