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
import StatementDownload from "../../api/statementdownload";

const reports = [
  {
    title: "Product Report",
    desc: "Track all products you’ve made or received.",
    formats: ["PDF", "Excel"],
    color: "red",
    icon: <Wallet className="text-red-600" />,
    hasFilter: true,
  },
  {
    title: "Customer Report",
    desc: "Complete list of all customers with outstanding credit details.",
    formats: ["PDF", "Excel"],
    color: "indigo",
    icon: <Users className="text-indigo-600" />,
    hasFilter: true,
  },
  {
    title: "Staff Report",
    desc: "Today, weekly, or monthly summaries of total staff performance and payroll tracking.",
    formats: ["PDF", "Excel"],
    color: "green",
    icon: <BookOpenCheck className="text-green-600" />,
    hasFilter: true,
  },
  {
    title: "Invoice Report",
    desc: "Complete list of all invoices with payment status and due dates.",
    formats: ["PDF", "Excel"],
    color: "blue",
    icon: <Receipt className="text-blue-600" />,
    hasFilter: true,
  },
  {
    title: "Expense Report",
    desc: "Categorized list of business expenses with GST and Non-GST classifications.",
    formats: ["PDF", "Excel"],
    color: "purple",
    icon: <Clock className="text-purple-600" />,
    hasFilter: true,
  },
  // {
  //   title: "Payment Collection Amount",
  //   desc: "Overview of all payments collected with due balances and promised dates.",
  //   formats: ["PDF", "Excel"],
  //   color: "yellow",
  //   icon: <CalendarClock className="text-yellow-600" />,
  //   hasFilter: true,
  // },
];

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

const filterOptions = ["Today", "Weekly", "Monthly", "Custom"];

const D11StatementDownloadUI = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  const toggleFilter = (index) =>
    setActiveFilter(activeFilter === index ? null : index);

  const selectFilter = (reportTitle, option) => {
    setSelectedFilters((prev) => ({ ...prev, [reportTitle]: option }));
    setActiveFilter(null);
  };

  const getDateRange = (filter) => {
    const today = new Date();
    let startDate, endDate;

    if (filter === "Today") {
      startDate = endDate = today.toISOString().split("T")[0];
    } else if (filter === "Weekly") {
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const lastDay = new Date(today.setDate(firstDay.getDate() + 6));
      startDate = firstDay.toISOString().split("T")[0];
      endDate = lastDay.toISOString().split("T")[0];
    } else if (filter === "Monthly") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      startDate = firstDay.toISOString().split("T")[0];
      endDate = lastDay.toISOString().split("T")[0];
    } else if (filter === "Custom") {
      startDate = customDates.start;
      endDate = customDates.end;
    } else {
      startDate = endDate = "";
    }

    return { startDate, endDate };
  };

  // ✅ Common download handler
  const downloadReport = async (reportTitle, format, filter) => {
    const { startDate, endDate } = getDateRange(filter);

    try {
      switch (reportTitle) {
        case "Product Report":
          if (format === "PDF") {
            await StatementDownload.exportPDF({ startDate, endDate });
          } else if (format === "Excel") {
            await StatementDownload.exportExcel({ startDate, endDate });
          } else {
            alert("❌ Unsupported format");
          }
          break;
        case "Customer Report":
          if (format === "PDF") {
            await StatementDownload.exportCustomerPDF({ startDate, endDate });
          } else if (format === "Excel") {
            await StatementDownload.exportCustomerExcel({ startDate, endDate });
          } else {
            alert("❌ Unsupported format");
          }
          break;
        case "Staff Report":
          if (format === "PDF")
            await StatementDownload.exportStaffPDF({ startDate, endDate });
          else if (format === "Excel")
            await StatementDownload.exportStaffExcel({ startDate, endDate });
          else alert("❌ Unsupported format");
          break;

        case "Invoice Report":
          if (format === "PDF")
            await StatementDownload.exportInvoicePDF({ startDate, endDate });
          else if (format === "Excel")
            await StatementDownload.exportInvoiceExcel({ startDate, endDate });
          else alert("❌ Unsupported format");
          break;

        case "Expense Report":
          if (format === "PDF")
            await StatementDownload.exportExpensePDF({ startDate, endDate });
          else if (format === "Excel")
            await StatementDownload.exportExpenseExcel({ startDate, endDate });
          else alert("❌ Unsupported format");
          break;

        // Add cases for other reports as needed
        default:
          alert(`🚧 ${reportTitle} not implemented yet.`);
      }
    } catch (err) {
      console.error("❌ Error generating report", err);
      alert("Failed to generate report.");
    }
  };

  return (
    <div className="py-5 px-5 md:px-4 sm:py-7 lg:py-14 max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
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

      {/* Reports List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="relative bg-white shadow rounded-lg p-4 border border-gray-100 hover:shadow-md transition"
            >
              {/* Report Header */}
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
                      <div className="absolute top-5 right-0 z-10 bg-white border border-gray-200 rounded shadow-lg w-40 p-2 space-y-1">
                        {filterOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => selectFilter(report.title, option)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Report Description */}
              <p className="text-sm text-gray-600 mb-4">{report.desc}</p>

              {/* Custom Date Range Picker */}
              {selectedFilters[report.title] === "Custom" && (
                <div className="mb-4 space-y-2">
                  <label className="block text-xs text-gray-500">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customDates.start}
                    onChange={(e) =>
                      setCustomDates((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-2 py-1 text-sm bg-white"
                  />
                  <label className="block text-xs text-gray-500">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customDates.end}
                    onChange={(e) =>
                      setCustomDates((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-2 py-1 text-sm bg-white"
                  />
                </div>
              )}

              {/* Download Buttons */}
              {/* Download Buttons */}
              <div className="flex flex-wrap gap-2">
                {report.formats.map((format) => (
                  <button
                    key={format}
                    className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 transition-all duration-150 shadow-sm
        ${colorClassMap[report.color]} 
        hover:opacity-90 active:scale-95 active:shadow-inner`}
                    onClick={() =>
                      downloadReport(
                        report.title,
                        format,
                        selectedFilters[report.title]
                      )
                    }
                  >
                    {formatIcons[format]} {format}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default D11StatementDownloadUI;
