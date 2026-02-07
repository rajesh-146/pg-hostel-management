import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function OwnerRentPage() {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRents();
  }, []);

  const fetchRents = async () => {
    try {
      const res = await API.get("/rent");
      setRents(res.data);
    } catch (err) {
      console.log("Error fetching rents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (rentId, studentId, studentEmail, studentName, month) => {
    try {
      await API.post("/rent/reminder", {
        rentId,
        studentId,
        studentEmail,
        studentName,
        month
      });
      alert(`Rent reminder sent to ${studentEmail}!`);
      fetchRents();
    } catch (err) {
      console.log("Error sending reminder:", err.message);
      alert("Failed to send reminder");
    }
  };

  const pendingRents = rents.filter(r => r.status === "pending");
  const paidRents = rents.filter(r => r.status === "paid");

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rent Management</h1>
        <button
          onClick={() => navigate("/owner")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div>Loading rents...</div>
      ) : (
        <div className="space-y-8">
          {/* PENDING RENTS */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              💰 Pending Rents ({pendingRents.length})
            </h2>
            {pendingRents.length === 0 ? (
              <p className="text-gray-500">No pending rents</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead className="bg-red-100">
                    <tr>
                      <th className="border p-3 text-left">Student Name</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Room</th>
                      <th className="border p-3 text-left">Month</th>
                      <th className="border p-3 text-left">Amount</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRents.map((rent) => (
                      <tr key={rent._id} className="hover:bg-gray-100">
                        <td className="border p-3">{rent.student?.name || "N/A"}</td>
                        <td className="border p-3">{rent.student?.email || "N/A"}</td>
                        <td className="border p-3">Room {rent.room?.roomNumber || "N/A"}</td>
                        <td className="border p-3">{rent.month}</td>
                        <td className="border p-3">₹{rent.amount}</td>
                        <td className="border p-3">
                          <span className="bg-red-200 text-red-800 px-3 py-1 rounded">
                            Pending
                          </span>
                        </td>
                        <td className="border p-3">
                          <button
                            onClick={() =>
                              sendReminder(
                                rent._id,
                                rent.student?._id,
                                rent.student?.email,
                                rent.student?.name,
                                rent.month
                              )
                            }
                            className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                          >
                            Send Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PAID RENTS */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              ✅ Paid Rents ({paidRents.length})
            </h2>
            {paidRents.length === 0 ? (
              <p className="text-gray-500">No paid rents</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="border p-3 text-left">Student Name</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Room</th>
                      <th className="border p-3 text-left">Month</th>
                      <th className="border p-3 text-left">Amount</th>
                      <th className="border p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidRents.map((rent) => (
                      <tr key={rent._id} className="hover:bg-gray-100">
                        <td className="border p-3">{rent.student?.name || "N/A"}</td>
                        <td className="border p-3">{rent.student?.email || "N/A"}</td>
                        <td className="border p-3">Room {rent.room?.roomNumber || "N/A"}</td>
                        <td className="border p-3">{rent.month}</td>
                        <td className="border p-3">₹{rent.amount}</td>
                        <td className="border p-3">
                          <span className="bg-green-200 text-green-800 px-3 py-1 rounded">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
