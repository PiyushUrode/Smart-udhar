import { FaRupeeSign } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaSms } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaFlagCheckered } from "react-icons/fa6";
import { FaBullhorn } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaGift } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import { FaSearch,  } from "react-icons/fa";

const reminders = [
  {
    name: "Sharma Traders",
    code: "#ST001",
    status: "Due Today",
    statusColor: "bg-[#FEE2E2] text-[#991B1B]",
    amount: "₹4,500",
    lastReminder: "WhatsApp sent 2 hours ago",
  },
  {
    name: "Kumar Enterprises",
    code: "#KE002",
    status: "3 Days Overdue",
    statusColor: "bg-[#FEE2E2] text-[#991B1B]",
    amount: "₹8,200",
    lastReminder: "SMS sent yesterday",
  },
];

const items = [
  {
    name: "A4 Paper",
    stock: 3,
    level: "Low Stock",
    levelColor: "bg-[#FFEDD5] text-[#9A3412]",
    message: "Reorder soon",
    messageColor: "text-orange-600",
  },
  {
    name: "Printer Ink Cartridge",
    stock: 1,
    level: "Critical",
    levelColor: "bg-red-100 text-red-600",
    message: "Critical - Reorder immediately",
    messageColor: "text-red-600",
  },
];

const logs = [
  {
    message: "WhatsApp sent to Sharma Traders",
    time: "2 hours ago",
    status: "Delivered",
    statusColor: "bg-[#DCFCE7] text-[#166534]",
    icon: <FaCheckCircle color="#22C55E" />,
  },
  {
    message: "SMS failed to Patel & Sons",
    time: "1 day ago",
    status: "Retry",
    statusColor: "bg-[#DBEAFE] text-[#1E40AF]",
    icon: <MdCancel color="#EF4444" />,
  },
];

const milestone = {
  company: "Verma & Co",
  step: "Payment Milestone 2 of 3",
  amount: "₹3,000",
  dueDate: "May 20, 2024",
  status: "Upcoming",
  statusColor: "bg-[#FEF9C3] text-[#854D0E]",
};

const notifications = [
  {
    icon: <FaGift />,
    title: "New Reward Feature Available!",
    message: "Earn points for every invoice sent. Redeem for premium features.",
    time: "2 hours ago",
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: <IoIosWarning color="#EA580C" />,
    title: "GST Rate Update",
    message:
      "New GST rates effective from June 1, 2024. Update your tax settings.",
    time: "1 day ago",
    iconColor: "bg-orange-100 text-orange-600",
  },
];

export default function D13Notification() {
  return (
    <div className="max-w-6xl mx-auto  px-4 py-6 mt-5 flex flex-col gap-4">
      <h1 className="text-2xl text-[#1F2937] font-robotoB ">
        Notifications
      </h1>
     <div className="relative w-full md:w-auto ">
                 <input
                   type="text"
                   placeholder="Search by User ID, Name, or Mobile"
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />
                 <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
               </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Due Today", "Overdue", "Stock", "System"].map((label) => (
          <span
            key={label}
            className={`px-4 py-2 rounded-full text-sm cursor-pointer border ${
              label === "All"
                ? "bg-[#3B82F6] text-white"
                : "bg-gray-100 text-[#374151]"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="max-w-5xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-orange-600 font-bold mr-2">
            <FaRupeeSign />
          </span>{" "}
          Pending Payment Reminders
        </h2>

        {reminders.map((reminder, idx) => (
          <div
            key={idx}
            className="bg-white shadow border border-[#E5E7EB] rounded-md p-4 mb-4"
          >
            <div className="flex flex-col">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {reminder.name}
                  </h3>
                  <span className="text-xs font-robotoR text-gray-500">
                    {reminder.code}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${reminder.statusColor}`}
                  >
                    {reminder.status}
                  </span>
                </div>
                <p className="text-[#DC2626] text-2xl font-robotoB mt-1">
                  {reminder.amount}
                </p>
                <p className="text-sm font-robotoR text-[#4B5563] mt-1">
                  Last reminder: {reminder.lastReminder}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button className="flex gap-2 items-center bg-[#22C55E] text-white text-sm px-3 py-1.5 rounded-md">
                  <FaWhatsapp />
                  WhatsApp
                </button>
                <button className="flex gap-2 items-center bg-[#3B82F6] text-white text-sm px-3 py-1 rounded-md">
                  <FaSms />
                  SMS
                </button>
                <button className="flex gap-2 items-center bg-[#A855F7] text-white text-sm px-3 py-1 rounded-md">
                  <IoCall />
                  Call
                </button>
                <button className="flex gap-2 items-center bg-[#F3F4F6] text-[#374151] text-sm px-3 py-1 rounded-md">
                  Mark as Paid
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-5xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-orange-600 font-bold mr-2">
            <FaBox />
          </span>{" "}
          Low Stock Alerts
        </h2>

        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start bg-white shadow-sm rounded-md p-4 mb-3 border border-[#E5E7EB]"
          >
            <div>
              <h3 className="font-semibold text-[#111827]">{item.name}</h3>
              <p className="text-sm font-robotoR text-[#4B5563] mt-1">
                Only {item.stock} left in stock
              </p>
              <p className={`text-xs font-robotoM mt-1 ${item.messageColor}`}>
                {item.message}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${item.levelColor} font-medium self-center`}
            >
              {item.level}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-5xl">
        <h2 className="text-lg font-semibold mb-4 text-[#111827] flex items-center">
          <span className="text-blue-600 mr-2">
            <IoMdMail />
          </span>{" "}
          Reminder Success Logs
        </h2>

        <div className="bg-white rounded-md shadow-sm p-4 border border-[#E5E7EB]">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex justify-between items-start py-2 border-[#E5E7EB] last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">{log.icon}</span>
                <div>
                  <p className="font-robotoM text-md text-[#111827]">
                    {log.message}
                  </p>
                  <p className="text-sm font-robotoR text-[#4B5563]">
                    {log.time}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium self-center ${log.statusColor}`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl">
        <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
          <span className="text-purple-600 mr-2">
            <FaFlagCheckered />
          </span>{" "}
          Payment Milestone Updates
        </h2>

        <div className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-4 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-[#111827]">
              {milestone.company}
            </h3>
            <p className="text-sm font-robotoR text-[#4B5563] mt-1">
              {milestone.step}
            </p>
            <p className="text-lg font-robotoB text-[#9333EA] mt-1">
              {milestone.amount}
            </p>
            <p className="text-sm font-robotoR text-[#4B5563]">
              Due on {milestone.dueDate}
            </p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${milestone.statusColor}`}
          >
            {milestone.status}
          </span>
        </div>
      </div>

      <div className="max-w-5xl">
        <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
          <span className="text-indigo-600 mr-2">
            <FaBullhorn />
          </span>{" "}
          System Notifications
        </h2>

        {notifications.map((note, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-white border border-[#E5E7EB] rounded-md p-4 mb-3 shadow-sm"
          >
            <div
              className={`w-10 h-12 rounded-xl flex items-center justify-center text-xl ${note.iconColor}`}
            >
              {note.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{note.title}</h3>
              <p className="text-sm font-robotoR text-[#4B5563]">
                {note.message}
              </p>
              <p className="text-xs font-robotoR text-[#6B7280] mt-1">
                {note.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
