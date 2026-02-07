import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    totalBeds: "",
    rentPerBed: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.log("Error fetching rooms:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await API.post("/rooms", {
        roomNumber: formData.roomNumber,
        totalBeds: formData.totalBeds,
        rentPerBed: formData.rentPerBed
      });
      alert("Room added successfully!");
      setFormData({ roomNumber: "", totalBeds: "", rentPerBed: "" });
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      console.log("Error adding room:", err.message);
      alert("Failed to add room");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-10">Loading rooms...</div>;
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Room"}
          </button>
          <button
            onClick={() => navigate("/owner")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddRoom} className="border p-6 rounded-lg mb-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="totalBeds"
              placeholder="Total Beds"
              value={formData.totalBeds}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="rentPerBed"
              placeholder="Rent per month"
              value={formData.rentPerBed}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add Room
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500 text-lg">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500 text-lg">No rooms found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="border p-6 rounded-lg shadow-md hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Room {room.roomNumber}</h3>
              <p className="text-gray-600 mb-2">
                <strong>Total Beds:</strong> {room.totalBeds}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Occupied:</strong> {room.occupiedBeds || 0} beds
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Rent:</strong> ₹{room.rentPerBed}/month
              </p>
              <p className={`font-semibold ${(room.occupiedBeds || 0) >= room.totalBeds ? "text-red-600" : "text-green-600"}`}>
                {(room.occupiedBeds || 0) >= room.totalBeds ? "Full" : "Available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
