import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/complaints");
        setComplaints(res.data || []);
      } catch (err) {
        console.error("Failed to load complaints:", err.message || err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latest = complaints.length ? complaints[complaints.length - 1] : null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-lg hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">📊 Rooms</h3>
          <p className="text-gray-600">Manage your PG rooms</p>
          <button 
            onClick={() => navigate("/rooms")}
            className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
          >
            View Rooms
          </button>
        </div>

        <div className="border p-6 rounded-lg hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">💰 Rent Payments</h3>
          <p className="text-gray-600">Track rent payments from students</p>
          <button 
            onClick={() => navigate("/owner-rent")}
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-700"
          >
            View Rent
          </button>
        </div>

        <div className="border p-6 rounded-lg hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">🔔 Notifications</h3>
          {loading ? (
            <p className="text-gray-600">Loading complaints...</p>
          ) : (
            <>
              <p className="text-gray-600">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} received</p>
              {latest ? (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="font-semibold">From: {latest.student?.name || "Unknown"}</p>
                  <p className="text-sm text-gray-700 mt-1">{latest.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Room: {latest.room || "-"}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No complaints yet</p>
              )}
              <button
                onClick={() => navigate("/owner-complaints")}
                className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-700"
              >
                View All Complaints
              </button>
            </>
          )}
        </div>

        <div className="border p-6 rounded-lg hover:shadow-lg">
          <h3 className="text-xl font-semibold mb-2">👥 Students</h3>
          <p className="text-gray-600">Manage student accounts</p>
          <button 
            onClick={() => navigate("/students")}
            className="bg-purple-600 text-white px-4 py-2 mt-4 rounded hover:bg-purple-700"
          >
            View Students
          </button>
        </div>
      </div>
    </div>
  );
}
