import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Share2,
  Link,
} from "lucide-react";
import Button from "../../common/Button";

export default function D15Invite() {
  // 🧠 Dynamically get website name from the current URL
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const siteName = hostname.replace(/^www\./, "").split(".")[0]; // e.g. "yourapp"
  const [popupType, setPopupType] = useState(null); // 'success', 'error', 'processing'

  const [message, setMessage] = useState("");
  const referralLink = `${window.location.origin}/invite`;

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`,
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: `https://twitter.com/intent/tweet?text=Join%20me%20on%20${encodeURIComponent(
        siteName
      )}!%20${encodeURIComponent(referralLink)}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        referralLink
      )}`,
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      url: `https://www.instagram.com/`, // Instagram doesn’t allow direct sharing links
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setPopupType("success");
      setMessage("Referral link copied to clipboard!");
    } catch (e) {
      setPopupType("error");
      setMessage("Failed to copy link. Please try again.");
      //
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join me on ${siteName}!`,
          text: "Here’s my invite link:",
          url: referralLink,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      setPopupType("error");
      setMessage("Sharing not supported on this device.");      
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Invite Friends Now 🚀</h1>
        <p className="text-gray-500 text-sm mb-6">
          Share your unique link with friends and get rewards when they join!
        </p>

        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md mb-4">
          <span className="truncate text-sm text-gray-700">{referralLink}</span>
          <button
            onClick={copyLink}
            className="ml-3 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center gap-1"
          >
            <Link size={14} /> Copy
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition"
            >
              <div className="text-indigo-600 mb-1">{social.icon}</div>
              <span className="text-xs text-gray-700 font-medium">
                {social.name}
              </span>
            </a>
          ))}
        </div>

        <button
          onClick={nativeShare}
          className="px-5 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 mx-auto"
        >
          <Share2 size={16} /> Share via Device
        </button>
      </div>
      {/* 🟢 The requested Button component integration for pop-up messages */} 
         {" "}
      {popupType && (
        <Button
          type={popupType}
          message={message}
          onClose={() => setPopupType(null)}
        />
      )}
    </div>
  );
}
