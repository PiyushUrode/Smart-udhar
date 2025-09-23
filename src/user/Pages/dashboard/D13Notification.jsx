import React, { useState, useEffect } from "react";
import "../../../../src/index.css"; // Ensure Tailwind CSS is imported
import {
  FaRupeeSign,
  FaWhatsapp,
  FaSms,
  FaCheckCircle,
  FaGift,
  FaBox,
  FaBullhorn,
} from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaFlagCheckered } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { Invoice } from "../../api/Invoice.js"; // your Invoice service
import { NotificationService } from "../../api/notification.js";


export default function D13Notification() {
  const [reminders, setReminders] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [items, setItems] = useState([]); // ✅ dynamic low stock items



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

  // ------------------ System Notifications ------------------
  useEffect(() => {
    const fetchSystemNotifications = async () => {
      try {
        const { success, notifications } =
          await NotificationService.fetchNotifications();
        if (success) {
          setSystemNotifications(
            notifications.map((n) => ({
              id: n._id,
              title: n.title,
              message: n.message,
              time: n.created_at,
              icon: <FaBullhorn />, // default icon
              iconColor: "bg-indigo-100 text-indigo-600",
            }))
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch system notifications:", err);
      }
    };
    fetchSystemNotifications();
  }, []);

  // ------------------ Fetch All Data ------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { invoices } = await Invoice.getAllInvoices();

        // ✅ Pending Payment Reminders
        const pendingReminders = invoices
          .filter((inv) => inv.paymentStatus !== "Paid")
          .map((inv) => ({
            id: inv._id,
            name: inv.name,
            code: `#${inv.invoiceNumber}`,
            status: inv.paymentStatus === "Due" ? "Due Today" : "Overdue",
            statusColor:
              inv.paymentStatus === "Due"
                ? "bg-[#FEF3F2] text-[#B91C1C]"
                : "bg-[#FEE2E2] text-[#991B1B]",
            amount: `₹${inv.total}`,
            lastReminder: inv.lastReminder || "No reminder sent",
          }));
        setReminders(pendingReminders);

        // ✅ Milestones
        const milestoneInvoices = invoices.filter(
          (inv) => inv.milestones?.length
        );
        const allMilestones = milestoneInvoices.flatMap((inv) =>
          inv.milestones.map((ms, idx) => ({
            id: `${inv._id}-${idx}`,
            invoiceId: inv._id,
            company: inv.name,
            step: ms.name,
            amount: `₹${ms.amount}`,
            dueDate: ms.dueDate,
            status: ms.paid ? "Paid" : "Upcoming",
            statusColor: ms.paid
              ? "bg-green-100 text-green-700"
              : "bg-[#FEF9C3] text-[#854D0E]",
          }))
        );
        setMilestones(allMilestones);

        // ✅ Low Stock Products
        const { products } = await Invoice.getProducts();
        const lowStockItems = products
          .filter((p) => p.quantity <= p.min_quantity) // <-- FIXED
          .map((p) => ({
            id: p._id,
            name: p.name,
            stock: p.quantity, // ✅ available stock
            level: p.quantity <= 2 ? "Critical" : "Low Stock",
            levelColor:
              p.quantity <= 2
                ? "bg-red-100 text-red-600"
                : "bg-[#FFEDD5] text-[#9A3412]",
            message:
              p.quantity <= 2
                ? "Critical - Reorder immediately"
                : "Reorder soon",
            messageColor:
              p.quantity <= 2 ? "text-red-600" : "text-orange-600",
          }));
        setItems(lowStockItems);
      } catch (err) {
        console.error("❌ Failed to fetch notification data:", err);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="max-w-6xl mx-auto px-4 py-6 mt-5 flex flex-col gap-4">
      <h1 className="text-2xl text-[#1F2937] font-robotoB">Notifications</h1>

      {/* ------------------ Payment Reminders ------------------ */}
      <div className="max-w-5xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaRupeeSign className="text-orange-600 mr-2" /> Pending Payment Reminders
        </h2>
 <div className="max-h-[500px] overflow-y-auto custom-scroll">
  {reminders.map((r) => (
    <div
      key={r.id}
      className="bg-white shadow border border-[#E5E7EB] rounded-md p-4 mb-4"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{r.name}</h3>
          <span className="text-xs font-robotoR text-gray-500">{r.code}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${r.statusColor}`}
          >
            {r.status}
          </span>
        </div>
        <p className="text-[#DC2626] text-2xl font-robotoB mt-1">{r.amount}</p>
        <p className="text-sm font-robotoR text-[#4B5563] mt-1">
          Last reminder: {r.lastReminder}
        </p>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => sendReminder(r.id, "WhatsApp")}
            className="flex gap-2 items-center bg-[#22C55E] text-white text-sm px-3 py-1.5 rounded-md"
          >
            <FaWhatsapp /> WhatsApp
          </button>
          <button
            onClick={() => sendReminder(r.id, "SMS")}
            className="flex gap-2 items-center bg-[#3B82F6] text-white text-sm px-3 py-1 rounded-md"
          >
            <FaSms /> SMS
          </button>
          <button
            onClick={() => sendReminder(r.id, "Call")}
            className="flex gap-2 items-center bg-[#A855F7] text-white text-sm px-3 py-1 rounded-md"
          >
            <IoCall /> Call
          </button>
          {r.status !== "Paid" && (
            <button
              onClick={() => markAsPaid(r.id)}
              className="flex gap-2 items-center bg-[#F3F4F6] text-[#374151] text-sm px-3 py-1 rounded-md"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

      </div>

      {/* ------------------ Low Stock Alerts ------------------ */}
              <div className="max-w-5xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-orange-600 font-bold mr-2">
            <FaBox />
          </span>{" "}
          Low Stock Alerts
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No low stock products 🎉</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start bg-white shadow-sm rounded-md p-4 mb-3 border border-[#E5E7EB]"
            >
              <div>
                <h3 className="font-semibold text-[#111827]">{item.name}</h3>
                <p className="text-sm font-robotoR text-[#4B5563] mt-1">
                  Only {item.stock} left in stock
                </p>
                <p
                  className={`text-xs font-robotoM mt-1 ${item.messageColor}`}
                >
                  {item.message}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${item.levelColor} font-medium self-center`}
              >
                {item.level}
              </span>
            </div>
          ))
        )}
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
      {/* ------------------ Milestones ------------------ */}
     <div className="max-w-5xl">
  <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
    <FaFlagCheckered className="text-purple-600 mr-2" /> Payment Milestone Updates
  </h2>

  {/* Scrollable container */}
  <div className="max-h-[500px] overflow-y-auto custom-scroll">
    {milestones.map((ms) => (
      <div
        key={`${ms.invoiceId}-${ms.step}`}
        className="bg-white rounded-md shadow-sm border border-[#E5E7EB] p-4 flex justify-between items-start mb-3"
      >
        <div>
          <h3 className="font-semibold text-[#111827]">{ms.company}</h3>
          <p className="text-sm font-robotoR text-[#4B5563] mt-1">{ms.step}</p>
          <p className="text-lg font-robotoB text-[#9333EA] mt-1">{ms.amount}</p>
          <p className="text-sm font-robotoR text-[#4B5563]">Due on {ms.dueDate}</p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${ms.statusColor}`}
        >
          {ms.status}
        </span>
      </div>
    ))}
  </div>
</div>


      {/* ------------------ System Notifications ------------------ */}
       {/* ------------------ System Notifications ------------------ */}
<div className="max-w-5xl max-h-[500px] overflow-y-auto custom-scroll">
  <h2 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
    <span className="text-indigo-600 mr-2">
      <FaBullhorn />
    </span>{" "}
    System Notifications
  </h2>

  {systemNotifications.length === 0 ? (
    <p className="text-sm text-gray-500">No system notifications</p>
  ) : (
    systemNotifications.map((note) => (
      <div
        key={note.id}
        className="flex items-start gap-3 bg-white border border-[#E5E7EB] rounded-md p-4 mb-3 shadow-sm"
      >
        <div
          className={`w-10 h-12 rounded-xl flex items-center justify-center text-xl ${note.iconColor}`}
        >
          {note.icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{note.title}</h3>
          <p className="text-sm font-robotoR text-[#4B5563]">{note.message}</p>
          <p className="text-xs font-robotoR text-[#6B7280] mt-1">
            {note.time}
          </p>
        </div>
      </div>
    ))
  )}
</div>

      {/* ------------------ Reminder Logs ------------------ */}
      
    </div>
  );
}
