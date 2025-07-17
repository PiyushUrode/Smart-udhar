import React from "react";
import { Check, X, Clock } from "lucide-react";

const statusMap = {
  processing: {
    icon: <Clock className="w-6 h-6 text-white" />,
    bg: "bg-[#3B82F6]",
    shadow: "shadow-[0_0_25px_#3B82F6]",
    ring: "border border-[#3B82F6]",
    text: "Processing",
    btn: "border border-blue-500 text-blue-500",
    tail: "bg-[#3B82F6]",
  },
  complete: {
    icon: <Clock className="w-6 h-6 text-white" />,
    bg: "bg-[#3B82F6]",
    shadow: "shadow-[0_0_25px_#3B82F6]",
    ring: "border border-[#3B82F6]",
    text: "Complete Your Profile",
    btn: "border border-blue-500 text-blue-500",
    tail: "bg-[#3B82F6]",
  },
  success: {
    icon: <Check className="w-6 h-6 text-white" />,
    bg: "bg-[#60D669]",
    shadow: "shadow-[0_0_25px_#60D669]",
    ring: "border border-[#60D669]",
    text: "Details Saved",
    btn: "border border-[#60D66999] text-[#60D66999]",
    tail: "bg-[#60D669]",
  },
  error: {
    icon: <X className="w-6 h-6 text-white" />,
    bg: "bg-[#FF1616]",
    shadow: "shadow-[0_0_25px_#FF161699]",
    ring: "border border-[#FF161699]",
    text: "Process Failed",
    btn: "border border-red-500 text-red-500",
    tail: "bg-[#FF1616]",
  },
};

const Button = ({ type = "error", onClose }) => {
  const { icon, bg, shadow, ring, text, btn, tail } = statusMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className=" relative p-6">         <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-5 w-[70%] rounded-b-lg ${tail}`}></div> 
      <div className="relative w-[260px]  bg-white rounded-lg shadow-lg text-center pb-6 pt-10 px-4">
        {/* Glowing icon */}
        <div
          className={`absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-[10px] ${bg} ${shadow} ${ring}`}
        >
          {icon}
        </div>

        {/* Text */}
        <p className="text-lg font-semibold mt-4">{text}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`mt-5 px-4 py-1 rounded ${btn}`}
        >
          Ok
        </button>

        {/* Tail base block (bottom shadow accent) */}

      </div>
      </div>
    </div>
  );
};



export default Button