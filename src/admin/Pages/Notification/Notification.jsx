import React, { useState } from "react";
import axios from "axios";

function SendNotification() {

   const Auth_token = localStorage.getItem("authToken") || ""; // Example token retrieval
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace this with your actual admin token
  const token = Auth_token;
  console.log("Auth_token",Auth_token);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/notification/send",
        {          
          title,
          message
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
      );

      alert(response.data.message || "Notification sent successfully!");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Send Notification</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-white text-black"
            placeholder="Enter notification title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded bg-white text-black"
            rows={4}
            placeholder="Enter notification message"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
}

export default SendNotification;
