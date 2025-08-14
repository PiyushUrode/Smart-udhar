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
  { name: "Anshul Kothari", amount: "₹5,230", due: "25 July 2024", mobile: "9876543210" },
  { name: "Rajesh Kumar", amount: "₹6,890", due: "26 July 2024", mobile: "9123456780" },
  { name: "Pooja Sharma", amount: "₹4,150", due: "27 July 2024", mobile: "9812345678" },
  { name: "Amit Verma", amount: "₹7,420", due: "28 July 2024", mobile: "9988776655" },
  { name: "Sneha Reddy", amount: "₹3,980", due: "29 July 2024", mobile: "9700012345" },
  { name: "Vikram Singh", amount: "₹9,210", due: "30 July 2024", mobile: "9609876543" },
  { name: "Neha Patel", amount: "₹8,540", due: "31 July 2024", mobile: "9512345678" },
  { name: "Arjun Mehta", amount: "₹5,780", due: "1 Aug 2024", mobile: "9409871234" },
  { name: "Rohit Bansal", amount: "₹6,320", due: "2 Aug 2024", mobile: "9321456789" },
  { name: "Divya Nair", amount: "₹7,910", due: "3 Aug 2024", mobile: "9256781234" },
  { name: "Manish Gupta", amount: "₹4,670", due: "4 Aug 2024", mobile: "9198765432" },
  { name: "Shreya Kapoor", amount: "₹9,560", due: "5 Aug 2024", mobile: "9112233445" },
  { name: "Harshad Joshi", amount: "₹8,130", due: "6 Aug 2024", mobile: "9876501234" },
  { name: "Kavita Iyer", amount: "₹6,750", due: "7 Aug 2024", mobile: "9765412309" },
  { name: "Siddharth Desai", amount: "₹5,940", due: "8 Aug 2024", mobile: "9654321789" },
  { name: "Priya Yadav", amount: "₹4,880", due: "9 Aug 2024", mobile: "9543217890" },
  { name: "Aditya Chawla", amount: "₹7,230", due: "10 Aug 2024", mobile: "9432178901" },
  { name: "Tanvi Saxena", amount: "₹8,910", due: "11 Aug 2024", mobile: "9321789012" },
  { name: "Ramesh Pillai", amount: "₹6,450", due: "12 Aug 2024", mobile: "9217890123" },
  { name: "Meena Agarwal", amount: "₹5,330", due: "13 Aug 2024", mobile: "9123450987" },
  { name: "Karan Malhotra", amount: "₹9,780", due: "14 Aug 2024", mobile: "9012349876" },
  { name: "Anita Das", amount: "₹4,560", due: "15 Aug 2024", mobile: "9988001122" },
  { name: "Deepak Tyagi", amount: "₹8,320", due: "16 Aug 2024", mobile: "9876009988" },
  { name: "Ritika Singh", amount: "₹6,150", due: "17 Aug 2024", mobile: "9760099887" },
  { name: "Suresh Menon", amount: "₹7,980", due: "18 Aug 2024", mobile: "9650099776" },
  { name: "Lavanya Rao", amount: "₹5,770", due: "19 Aug 2024", mobile: "9540099665" },
  { name: "Yash Jain", amount: "₹9,340", due: "20 Aug 2024", mobile: "9430099554" },
  { name: "Pankaj Chauhan", amount: "₹6,890", due: "21 Aug 2024", mobile: "9320099443" },
  { name: "Ishita Bhatt", amount: "₹8,210", due: "22 Aug 2024", mobile: "9210099332" },
  { name: "Sunil Ghosh", amount: "₹4,990", due: "23 Aug 2024", mobile: "9100099221" },
  { name: "Nidhi Kulkarni", amount: "₹7,640", due: "24 Aug 2024", mobile: "9098765432" },
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
    {/* Collection Call List */}
<div className="bg-white p-4 rounded-md shadow md:col-span-2 lg:col-span-3">
  <h2 className="text-lg text-[#1F2937] font-robotoSb mb-4">
    Collection Call List
  </h2>
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
