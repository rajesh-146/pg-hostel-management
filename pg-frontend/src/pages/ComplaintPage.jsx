import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ComplaintPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const navigate = useNavigate();

  // Fetch student's booked rooms
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/bookings/my-rooms");
        setRooms(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedRoom(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load rooms:", err.message);
        alert("Failed to load your rooms. Please try again.");
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !message) {
      alert("Please select a room and enter a complaint message");
      return;
    }

    setLoading(true);
    try {
      await API.post("/complaints", { room: selectedRoom, message });
      alert("Complaint sent to owner!");
      setMessage("");
      setTimeout(() => navigate("/student"), 1500);
    } catch (err) {
      console.error("Error sending complaint:", err.message);
      alert("Failed to send complaint");
    } finally {
      setLoading(false);
    }
  };

  const selectedRoomData = rooms.find(r => r._id === selectedRoom);

  return (
    <div className="p-10 max-w-md mx-auto">
      <button
        onClick={() => navigate("/student")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Raise Complaint</h1>

      {loadingRooms ? (
        <p className="text-center text-gray-600">Loading your rooms...</p>
      ) : rooms.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
          <p className="text-yellow-800 font-semibold">No rooms booked yet</p>
          <p className="text-yellow-700 text-sm mt-2">You need to book a room before raising a complaint.</p>
          <button
            onClick={() => navigate("/student")}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={send} className="border p-6 rounded-lg bg-gray-50">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Your Room:</label>
            <select
              className="border p-3 w-full rounded"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>
            {selectedRoomData && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: Room {selectedRoomData.roomNumber}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Complaint Message:</label>
            <textarea
              className="border p-3 w-full rounded h-32"
              placeholder="Describe your complaint in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 w-full rounded hover:bg-red-700 font-semibold disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Complaint"}
          </button>
        </form>
      )}
    </div>
  );
}
