import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/auth/users");
        const studentList = res.data.filter(user => user.role === "student");
        setStudents(studentList);
      } catch (err) {
        console.log("Error fetching students:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-10">Loading students...</div>;
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students Management</h1>
        <button
          onClick={() => navigate("/owner")}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500 text-lg">No students found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Room</th>
                <th className="border p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-100">
                  <td className="border p-3">{student.name}</td>
                  <td className="border p-3">{student.email}</td>
                  <td className="border p-3">{student.phone || "N/A"}</td>
                  <td className="border p-3">{student.room || "Not assigned"}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded ${student.active ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                      {student.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
