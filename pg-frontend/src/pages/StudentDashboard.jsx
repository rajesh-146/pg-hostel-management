import { useEffect, useState } from "react";
import API from "../api/api";

export default function StudentDashboard() {
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    const res = await API.get("/rooms/available");
    setRooms(res.data);
  };

  useEffect(() => {
    (async () => {
      await loadRooms();
    })();
  }, []);

  const book = async (id) => {
    await API.post("/bookings", { roomId: id });
    alert("Booked!");
    loadRooms();
  };

  return (
    <div className="p-10">
      
      {/* TOP BUTTONS */}
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = "/rent")}
          className="bg-gray-800 text-white px-3 py-1 mr-2"
        >
          My Rent
        </button>

        <button
          onClick={() => (window.location.href = "/complaint")}
          className="bg-red-600 text-white px-3 py-1"
        >
          Complaint
        </button>
      </div>

      <h1 className="text-3xl mb-6">Available Rooms</h1>

      {rooms.map((r) => (
        <div key={r._id} className="border p-4 mb-3 w-96">
          <p>Room: {r.roomNumber}</p>
          <p>Rent: ₹{r.rentPerBed}</p>
          <p>Beds left: {r.totalBeds - r.occupiedBeds}</p>

          <button
            onClick={() => book(r._id)}
            className="bg-green-600 text-white px-3 py-1 mt-2"
          >
            Book Bed
          </button>
        </div>
      ))}
    </div>
  );
}
