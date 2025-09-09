import { useState, useEffect } from "react";
import { FaTrophy, FaExclamationTriangle, FaGavel } from "react-icons/fa";
import { FaDownload, FaChartLine } from "react-icons/fa6";
import ReactSpeedometer from "react-d3-speedometer";
import { Invoice } from "../../api/Invoice"; // apna path check karna

const D9CreditScore = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🚀 Fetch data from API
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      const { success, customers } = await Invoice.fetchCustomersForInvoice({
        page: 1,
        limit: 50,
      });

      if (success && customers.length > 0) {
        setCustomers(customers);
      }
      setLoading(false);
    };
    loadCustomers();
  }, []);

  // 🔹 Calculate Summary Stats
  const scores = customers.map((c) => c.creditScore || 0);
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const bestPerformers = customers.filter((c) => c.creditScore >= 75);
  const lowPerformers = customers.filter((c) => c.creditScore < 50);
  const legalCases = customers.filter((c) => c.status === "Legal Action");

  return (
    <div className="p-0 sm:p-6 bg-gray-50 min-h-screen">
      <Header />

      {/* Summary Cards */}
      <SummaryCards
        avgScore={avgScore}
        bestCount={bestPerformers.length}
        lowCount={lowPerformers.length}
        legalCount={legalCases.length}
      />

      <div className="grid grid-cols-1 gap-4 bg-gray-50 p-0 sm:p-6 rounded-md shadow md:grid-cols-5">
        {/* Gauge Chart */}
        <div className="bg-white p-4 rounded-md shadow md:col-span-3 lg:col-span-2 text-center md:text-left ">
          <h2 className="text-lg font-robotoSb text-[#1F2937] mb-4">
            Average Credit Score Distribution
          </h2>
          <div className="flex justify-center items-center h-full">
            <ReactSpeedometer
              value={avgScore}
              minValue={0}
              maxValue={100}
              segments={3}
              segmentColors={["red", "#FFE95B", "green"]}
              customSegmentStops={[0, 50, 75, 100]}
              needleColor="#6B7280"
              currentValueText=""
              ringWidth={40}
              needleHeightRatio={0.7}
              width={280}
              height={190}
            />
          </div>
        </div>

        {/* Collection Call List */}
        <div className="bg-white p-4 rounded-md shadow md:col-span-2 lg:col-span-3">
          <h2 className="text-lg text-[#1F2937] font-robotoSb mb-4">Collection Call List</h2>

          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : customers.length === 0 ? (
            <p className="text-gray-500 text-center">No data available</p>
          ) : (
            <div className="min-w-[600px] max-h-[320px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-[#4B5563] text-[16px] font-semibold border-b">
                    <th className="py-2 pr-4 whitespace-nowrap">Name</th>
                    <th className="py-2 pr-4 whitespace-nowrap">Amount</th>
                    <th className="py-2 pr-4 whitespace-nowrap">Due Date</th>
                    <th className="py-2 pr-4 whitespace-nowrap">Mobile No.</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, idx) => (
                    <tr key={idx} className="border-b text-[16px] last:border-none">
                      <td className="py-2 pr-4 text-[#1F2937]">{c.name}</td>
                      <td className="py-2 pr-4 font-robotoR text-md">
                        ₹{c.dueAmount || 0}
                      </td>
                      <td className="py-2 pr-4 text-[#4B5563]">
                        {c.dueDate ? new Date(c.dueDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-2 pr-4 text-[#4B5563]">{c.mobile || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Best Performers */}
      <TableSection
        title="Best Performers (Score: 75-100)"
        headers={["Customer", "Credit Score", "On-Time Payments", "Total Purchase", "Status"]}
      >
        {bestPerformers.map((c, idx) => (
          <BestPerformerRow
            key={idx}
            id={c.customerId}
            name={c.name}
            score={c.creditScore}
            onTime={c.onTime || "N/A"}
            purchase={c.purchase || "₹0"}
            status="Excellent"
          />
        ))}
      </TableSection>

      {/* Low Performers */}
      <TableSection
        title="Low Performers (Score: 0-50)"
        headers={["Customer", "Credit Score", "Delay Days", "Penalties", "Action"]}
      >
        {lowPerformers.map((c, idx) => (
          <LowPerformerRow
            key={idx}
            id={c.customerId}
            name={c.name}
            score={c.creditScore}
            delay={c.delayDays || "-"}
            penalties={c.penalties || "₹0"}
            action={c.status || "Warning"}
          />
        ))}
      </TableSection>
    </div>
  );
};

const Header = () => (
  <div className="flex justify-between items-center my-5 p-6 md:p-0 ">
    <h1 className="text-base sm:text-2xl font-robotoB text-[#1F2937]">
      Credit Score Management
    </h1>
    <button className="flex items-center gap-2 bg-blue-600 font-robotoR text-white text-xs sm:text-md px-4 py-2 rounded-lg hover:bg-blue-700">
      <FaDownload size={16} />
      Export Report
    </button>
  </div>
);

const SummaryCards = ({ avgScore, bestCount, lowCount, legalCount }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
    <SummaryCard icon={<FaChartLine color="blue" />} label="Average Score" value={avgScore} color="black" />
    <SummaryCard icon={<FaTrophy />} label="Best Performers" value={bestCount} color="green" />
    <SummaryCard icon={<FaExclamationTriangle />} label="Low Performers" value={lowCount} color="red" />
    <SummaryCard icon={<FaGavel />} label="Legal Cases" value={legalCount} color="orange" />
  </div>
);

const SummaryCard = ({ icon, label, value, color }) => {
  const colors = {
    black: { icon: "text-black", bg: "bg-blue-100" },
    green: { icon: "text-green-600", bg: "bg-green-100" },
    red: { icon: "text-red-600", bg: "bg-red-100" },
    orange: { icon: "text-orange-600", bg: "bg-orange-100" },
  };
  return (
    <div className="bg-white p-4 px-8 md:px-4 rounded shadow-sm flex items-center justify-between w-full mx-auto">
      <div>
        <p className="text-sm font-robotoR text-[#4B5563]">{label}</p>
        <p className={`text-2xl font-robotoB ${colors[color].icon}`}>{value}</p>
      </div>
      <div className={`px-3 py-4 rounded-xl ${colors[color].bg}`}>
        <div className={`w-6 h-6 flex items-center justify-center ${colors[color].icon} text-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const TableSection = ({ title, headers, children }) => (
  <div className="bg-white rounded shadow-sm mb-6 px-3 md:px-10">
    <h2 className="text-lg font-medium text-[#1F2937] p-4 border-b">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-3 font-robotoM text-[16px] text-[#4B5563]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);

const BestPerformerRow = ({ id, name, score, onTime, purchase, status }) => (
  <tr className="border-t">
    <td className="p-3">
      <div>
        <p className="font-robotoM text-[16px] text-[#1F2937]">{name}</p>
        <p className="font-robotoR text-sm text-[#4B5563]">ID: {id}</p>
      </div>
    </td>
    <td className="p-3 text-[#166534] font-robotoM">
      <div className="text-center bg-[#DCFCE7] w-12 h-6 rounded-2xl">{score}</div>
    </td>
    <td className="p-3 font-robotoR text-[16px]">{onTime}</td>
    <td className="p-3 font-robotoR text-[16px]">{purchase}</td>
    <td className="p-3">
      <span className="px-3 py-1 font-robotoR text-sm rounded-full bg-green-100 text-[#166534]">
        {status}
      </span>
    </td>
  </tr>
);

const LowPerformerRow = ({ id, name, score, delay, penalties, action }) => (
  <tr className="border-t ">
    <td className="p-3">
      <div>
        <p className="font-robotoM text-[16px] text-[#1F2937]">{name}</p>
        <p className="font-robotoR text-sm text-[#4B5563]">ID: {id}</p>
      </div>
    </td>
    <td className="p-3 text-[#991B1B] font-bold">
      <div className="text-center bg-[#FEE2E2] w-12 h-6 rounded-2xl">{score}</div>
    </td>
    <td className="p-3 font-robotoR text-[16px]">{delay}</td>
    <td className="p-3 font-robotoR text-[16px]">{penalties}</td>
    <td className="p-3">
      {action === "Legal Action" && (
        <span className="px-3 py-1 text-sm font-robotoR bg-orange-100 text-[#9A3412] rounded-full">
          ⚖ Legal Action
        </span>
      )}
      {action === "Collection" && (
        <span className="px-3 py-1 text-sm font-robotoR bg-red-100 text-[#991B1B] rounded-full">
          🚫 Collection
        </span>
      )}
      {action === "Warning" && (
        <span className="px-3 py-1 text-sm font-robotoR bg-yellow-100 text-[#854D0E] rounded-full">
          ! Warning
        </span>
      )}
    </td>
  </tr>
);

export default D9CreditScore;
