import { useEffect, useState } from "react";
import API from "../api/api";

export default function OwnerComplaints() {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await API.get("/complaints");
    setList(res.data);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to remove this complaint?")) {
      return;
    }
    try {
      await API.delete(`/complaints/${id}`);
      load();
    } catch (err) {
      console.error("Failed to delete complaint:", err.message);
      alert("Failed to delete complaint");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Complaints</h1>

      {list.map((c) => (
        <div key={c._id} className="border p-3 mb-3 w-96">
          <p>Room: {c.room.roomNumber}</p>
          <p>{c.message}</p>
          <p>Status: {c.status}</p>

          <button
            onClick={() => deleteComplaint(c._id)}
            className="bg-red-600 text-white px-3 py-1 mt-2 rounded hover:bg-red-700"
          >
            Mark as Solved & Remove
          </button>
        </div>
      ))}
    </div>
  );
}
