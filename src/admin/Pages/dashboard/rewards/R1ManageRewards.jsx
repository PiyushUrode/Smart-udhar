import React from "react";
import { Gift, Award, BarChart3, Search, Download } from "lucide-react";

const rewardsData = [
  {
    id: 1,
    customer: "Ravi Sharma",
    points: 150,
    status: "Redeemed",
    expiry: "2025-08-15",
    badge: "Silver",
  },
  {
    id: 2,
    customer: "Anjali Verma",
    points: 320,
    status: "Active",
    expiry: "2025-10-01",
    badge: "Gold",
  },
  {
    id: 3,
    customer: "Manish Patel",
    points: 90,
    status: "Expired",
    expiry: "2025-07-10",
    badge: "Bronze",
  },
  {
    id: 4,
    customer: "Priya Singh",
    points: 450,
    status: "Active",
    expiry: "2025-11-25",
    badge: "Platinum",
  },
  {
    id: 5,
    customer: "Vikas Mehta",
    points: 200,
    status: "Pending",
    expiry: "2025-09-15",
    badge: "Silver",
  },
];

const statusColor = {
  Active: "bg-green-100 text-green-700",
  Redeemed: "bg-blue-100 text-blue-700",
  Expired: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-800",
};

const badgeColor = {
  Bronze: "bg-yellow-200 text-yellow-900",
  Silver: "bg-gray-300 text-gray-800",
  Gold: "bg-amber-300 text-amber-900",
  Platinum: "bg-indigo-200 text-indigo-800",
};

const R1ManageRewards = () => {
  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <Gift size={20} /> Manage Rewards
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

      {/* Reward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewardsData.map((reward) => (
          <div
            key={reward.id}
            className="bg-white shadow-customCard rounded-xl p-4 flex flex-col gap-2 border-l-4 border-bluecol"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-robotoB text-gray-900">
                  {reward.customer}
                </h3>
                <p className="text-sm text-gray-500">
                  Expiry: {reward.expiry}
                </p>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-md ${statusColor[reward.status]}`}
              >
                {reward.status}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm flex items-center gap-2">
                <Award size={16} className="text-yellow-600" />
                <span
                  className={`text-xs px-2 py-1 rounded-md ${badgeColor[reward.badge]}`}
                >
                  {reward.badge}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm font-interSb text-gray-800">
                  {reward.points} Points
                </span>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 rounded-full bg-bluecol"
                    style={{
                      width: `${Math.min(reward.points / 5, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gamification Banner */}
      <div className="bg-[#F0F4FF] p-4 rounded-lg flex items-center gap-3 mt-6 shadow-customCard">
        <BarChart3 className="text-bluecol" size={24} />
        <div>
          <h4 className="text-base font-robotoB text-bluecol">
            Gamification Features Coming Soon!
          </h4>
          <p className="text-sm text-gray-600">
            Leaderboards, badges, and milestone rewards to engage customers
            better.
          </p>
        </div>
      </div>
    </div>
  );
};

export default R1ManageRewards;
