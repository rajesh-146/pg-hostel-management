import { useEffect, useState } from "react";
import API from "../api/api";

export default function RentPage() {
  const [rents, setRents] = useState([]);

  const load = async () => {
    const res = await API.get("/rent/my");
    setRents(res.data);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const pay = async (id) => {
    await API.post("/rent/pay", { rentId: id });
    load();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">My Rent</h1>

      {rents.map((r) => (
        <div key={r._id} className="border p-4 mb-3 w-96">
          <p>Room: {r.room.roomNumber}</p>
          <p>Month: {r.month}</p>
          <p>Status: {r.status}</p>

          {r.status === "pending" && (
            <button
              onClick={() => pay(r._id)}
              className="bg-blue-600 text-white px-3 py-1 mt-2"
            >
              Pay Rent
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
