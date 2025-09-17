import React, { useState } from "react";
import {
  MessageCircle,
  Search,
  Download,
  HelpCircle,
  User,
  Tag,
  MessageSquare,
  Inbox,
} from "lucide-react";

const ticketData = [
  {
    id: "#TKT-1001",
    customer: "Ravi Sharma",
    issue: "Payment not reflected",
    status: "Open",
    priority: "High",
    assignee: "Anjali",
  },
  {
    id: "#TKT-1002",
    customer: "Priya Verma",
    issue: "Cannot login to portal",
    status: "In Progress",
    priority: "Medium",
    assignee: "Vikas",
  },
  {
    id: "#TKT-1003",
    customer: "Manoj Patel",
    issue: "Invoice generation error",
    status: "Resolved",
    priority: "Low",
    assignee: "Admin",
  },
  {
    id: "#TKT-1004",
    customer: "Asha Jain",
    issue: "Mobile number not updating",
    status: "Pending",
    priority: "High",
    assignee: "Support",
  },
  {
    id: "#TKT-1005",
    customer: "Deepak Yadav",
    issue: "App crashing on open",
    status: "Open",
    priority: "Critical",
    assignee: "Rahul",
  },
];

const priorityColor = {
  Critical: "bg-red-700 text-white",
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-700",
};

const statusColor = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Resolved: "bg-green-100 text-green-700",
  Pending: "bg-gray-100 text-gray-800",
};

const S1SupportTickets = () => {
  const [activeTab, setActiveTab] = useState("Tickets");

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto font-interR space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center  mb-4">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <HelpCircle size={20} /> Support Center
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-sm bg-bluecol text-white px-3 py-1.5 rounded-md hover:bg-blue-700">
            <Search size={14} /> Search
          </button>
          <button className="flex items-center gap-1 text-sm border px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-6 text-sm font-interSb">
        {["Tickets", "Live Chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-bluecol text-bluecol"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tickets Tab */}
      {activeTab === "Tickets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {ticketData.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-customCard p-4 space-y-2 border-l-4 border-bluecol"
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-robotoB text-gray-800">
                  {ticket.id}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-md ${priorityColor[ticket.priority]}`}
                >
                  {ticket.priority}
                </div>
              </div>
              <div className="text-sm text-gray-700">{ticket.issue}</div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  {ticket.customer}
                </div>
                <div className="flex items-center gap-1">
                  <Inbox size={12} />
                  {ticket.assignee}
                </div>
              </div>
              <div
                className={`inline-block text-xs px-2 py-1 rounded-md mt-2 ${statusColor[ticket.status]}`}
              >
                {ticket.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Chat Tab */}
      {activeTab === "Live Chat" && (
        <div className="bg-white shadow-customCard p-6 rounded-xl text-center text-gray-500 text-sm">
          <MessageSquare className="mx-auto mb-2 text-bluecol" size={24} />
          Live Chat feature with canned responses and SLA tracking coming soon.
        </div>
      )}
    </div>
  );
};

export default S1SupportTickets;
