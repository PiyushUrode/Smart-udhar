import { FaTrophy, FaExclamationTriangle, FaGavel } from "react-icons/fa";
import { FaDownload, FaChartLine } from "react-icons/fa6";
import ReactSpeedometer from "react-d3-speedometer";
import { ResponsiveContainer } from "recharts";

const D9CreditScore = () => {
  const data = [
    { name: "Good", value: 30 },
    { name: "Average", value: 40 },
    { name: "Poor", value: 30 },
  ];

  const COLORS = ["#29E100", "#F9E800", "#FF0000"];

  const callList = [
    {
      name: "Rajesh Kumar",
      amount: "₹5,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
    {
      name: "Anshul Kothari",
      amount: "₹5,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
    {
      name: "Rajesh Kumar",
      amount: "₹6,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
    {
      name: "Anshul Kothari",
      amount: "₹7,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
    {
      name: "Rajesh Kumar",
      amount: "₹8,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
    {
      name: "Anshul Kothari",
      amount: "₹9,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
    {
      name: "Rajesh Kumar",
      amount: "₹2,230",
      due: "25 July 2024",
      mobile: "789878987",
    },
  ];

  const bestPerformers = [
    {
      id: "CU001",
      name: "Rajesh Kumar",
      score: 92,
      onTime: "98%",
      purchase: "₹45,230",
      status: "Excellent",
    },
    {
      id: "CU002",
      name: "Priya Sharma",
      score: 86,
      onTime: "96%",
      purchase: "₹38,450",
      status: "Excellent",
    },
    {
      id: "CU003",
      name: "Amit Shah",
      score: 83,
      onTime: "94%",
      purchase: "₹52,100",
      status: "Very Good",
    },
  ];

  const lowPerformers = [
    {
      id: "CU004",
      name: "Anshul Kothari",
      score: 45,
      delay: "45 days",
      penalties: "₹2,340",
      action: "Legal Action",
    },
    {
      id: "CU005",
      name: "Sunita Patel",
      score: 35,
      delay: "62 days",
      penalties: "₹3,120",
      action: "Collection",
    },
    {
      id: "CU006",
      name: "Suresh Kumar",
      score: 25,
      delay: "28 days",
      penalties: "₹1,890",
      action: "Warning",
    },
  ];

  return (
    <div className="p-0 sm:p-6 bg-gray-50 min-h-screen">
      <Header />
      <SummaryCards />
      <div className="grid grid-cols-1 gap-4 bg-gray-50 p-0 sm:p-6 rounded-md shadow md:grid-cols-5">
        {/* Gauge Chart */}
        <div className="bg-white p-4 rounded-md shadow md:col-span-3 lg:col-span-2 text-center md:text-left ">
          <h2 className="text-lg font-robotoSb text-[#1F2937] mb-4">
            Average Credit Score Distribution
          </h2>
          <div className="flex justify-center items-center h-full">
            <ReactSpeedometer
              value={650}
              minValue={0}
              maxValue={800}
              segments={3}
              segmentColors={["#66DD66", "#FFE95B", "#F44336"]}
              customSegmentStops={[0, 267, 534, 800]}
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
        <div className="bg-white p-4 rounded-md shadow md:col-span-2 lg:col-span-3 overflow-x-auto">
          <h2 className="text-lg text-[#1F2937] font-robotoSb mb-4">
            Collection Call List
          </h2>
          <div className="min-w-[600px]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[#4B5563] text-[16px] font-semibold border-b">
                  <th className="py-2 pr-4 whitespace-nowrap">Name</th>
                  <th className="py-2 pr-4 whitespace-nowrap">Amount</th>
                  <th className="py-2 pr-4 whitespace-nowrap">Due Date</th>
                  <th className="py-2 pr-4 whitespace-nowrap">Mobile No.</th>
                </tr>
              </thead>
              <tbody>
                {callList.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b text-[16px] last:border-none"
                  >
                    <td className="py-2 pr-4 text-[#1F2937]">{item.name}</td>
                    <td className="py-2 pr-4 font-robotoR text-md">
                      {item.amount}
                    </td>
                    <td className="py-2 pr-4 text-[#4B5563]">{item.due}</td>
                    <td className="py-2 pr-4 text-[#4B5563]">{item.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <ChartPlaceholder /> */}
      <TableSection
        title="Best Performers (Score: 1-100)"
        headers={[
          "Customer",
          "Credit Score",
          "On-Time Payments",
          "Total Purchase",
          "Status",
        ]}
      >
        {bestPerformers.map((item) => (
          <BestPerformerRow key={item.id} {...item} />
        ))}
      </TableSection>
      <TableSection
        title="Low Performers (Score: 1-50)"
        headers={[
          "Customer",
          "Credit Score",
          "Delay Days",
          "Penalties",
          "Action",
        ]}
      >
        {lowPerformers.map((item) => (
          <LowPerformerRow key={item.id} {...item} />
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

const SummaryCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
    <SummaryCard
      icon={<FaChartLine color="blue" />}
      label="Average Score"
      value="742"

      color="black"
    />
    <SummaryCard
      icon={<FaTrophy />}
      label="Best Performers"
      value="156"
      color="green"
    />
    <SummaryCard
      icon={<FaExclamationTriangle />}
      label="Low Performers"
      value="89"
      color="red"
    />
    <SummaryCard
      icon={<FaGavel />}
      label="Legal Cases"
      value="12"
      color="orange"
    />
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
        <div
          className={`w-6 h-6 flex items-center justify-center ${colors[color].icon} text-lg`}
        >
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
              <th
                key={i}
                className="p-3 font-robotoM text-[16px] text-[#4B5563]"
              >
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
      <div className="text-center bg-[#DCFCE7] w-12 h-6 rounded-2xl">
        {score}
      </div>
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

const LowPerformerRow = ({ id, name, score, delay, penalties, action }) => {
  const actionStyles = {
    "Legal Action": "bg-orange-100 text-[#9A3412]",
    Collection: "bg-red-100 text-[#991B1B]",
    Warning: "bg-yellow-100 text-[#854D0E]",
  };
  return (
    <tr className="border-t ">
      <td className="p-3">
        <div>
          <p className="font-robotoM text-[16px] text-[#1F2937]">{name}</p>
          <p className="font-robotoR text-sm text-[#4B5563]">ID: {id}</p>
        </div>
      </td>
      <td className="p-3 text-[#991B1B] font-bold">
        <div className="text-center bg-[#FEE2E2] w-12 h-6 rounded-2xl">
          {score}
        </div>
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
};

export default D9CreditScore;
