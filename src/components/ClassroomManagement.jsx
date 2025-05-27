// src/components/ClassroomManagement.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../utils/toast";
import { API } from "../services/api";
import { useUsers } from "../context/UserContext";

function ClassroomManagement() {
  const { users } = useUsers();
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    address: { street: "", city: "", state: "", zip: "", country: "" },
    managerIds: [],
  });

  const fetchClassrooms = async () => {
    try {
      const response = await API.get("/api/classrooms/");
      setClassrooms(response.data);
    } catch (error) {
      showToast("Failed to fetch classrooms.", "error");
    }
  };

  const handleAddClassroom = async () => {
    if (!newClassroom.name || !newClassroom.address.street) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    try {
      const response = await API.post("/api/classrooms/", newClassroom);
      setClassrooms((prev) => [...prev, response.data]);
      setNewClassroom({
        name: "",
        address: { street: "", city: "", state: "", zip: "", country: "" },
        managerIds: [],
      });
      showToast("Classroom added successfully!", "success");
    } catch (error) {
      showToast("Failed to add classroom.", "error");
    }
  };

  React.useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-heading-lg font-extrabold text-center text-gray-800 mb-8">
          Classroom Management
        </h1>
        <Link
          to="/admin-dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-body-md mb-6 block"
        >
          ← Back to Dashboard
        </Link>
        <div className="mb-8">
          <h2 className="text-subheading font-semibold text-gray-800 mb-4">
            Add New Classroom
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={newClassroom.name}
              onChange={(e) =>
                setNewClassroom({ ...newClassroom, name: e.target.value })
              }
              placeholder="Classroom Name"
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="Classroom Name"
            />
            <input
              type="text"
              value={newClassroom.address.street}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  address: { ...newClassroom.address, street: e.target.value },
                })
              }
              placeholder="Street Address"
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="Street Address"
            />
            <input
              type="text"
              value={newClassroom.address.city}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  address: { ...newClassroom.address, city: e.target.value },
                })
              }
              placeholder="City"
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="City"
            />
            <input
              type="text"
              value={newClassroom.address.state}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  address: { ...newClassroom.address, state: e.target.value },
                })
              }
              placeholder="State"
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="State"
            />
            <input
              type="text"
              value={newClassroom.address.zip}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  address: { ...newClassroom.address, zip: e.target.value },
                })
              }
              placeholder="ZIP Code"
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="ZIP Code"
            />
            <input
              type="text"
              value={newClassroom.address.country}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  address: { ...newClassroom.address, country: e.target.value },
                })
              }
              placeholder="Country"
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="Country"
            />
            <select
              multiple
              value={newClassroom.managerIds}
              onChange={(e) =>
                setNewClassroom({
                  ...newClassroom,
                  managerIds: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="w-full px-4 py-3 border rounded-lg text-body-md"
              aria-label="Select Managers"
            >
              {users
                .filter((s) => s.role === "manager")
                .map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} ({manager.id})
                  </option>
                ))}
            </select>
          </div>
          <button
            onClick={handleAddClassroom}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-body-md"
          >
            Add Classroom
          </button>
        </div>
        <h2 className="text-subheading font-semibold text-gray-800 mb-4">
          Existing Classrooms
        </h2>
        {classrooms.length === 0 ? (
          <p className="text-gray-600 text-body-md">No classrooms available.</p>
        ) : (
          <ul className="space-y-4">
            {classrooms.map((classroom) => (
              <li
                key={classroom.id}
                className="p-4 bg-gray-50 rounded-lg border"
              >
                <p className="text-body-md text-gray-800">
                  <span className="font-medium">Name:</span> {classroom.name}
                </p>
                <p className="text-body-md text-gray-800">
                  <span className="font-medium">Address:</span>{" "}
                  {classroom.address.street}, {classroom.address.city},{" "}
                  {classroom.address.state} {classroom.address.zip},{" "}
                  {classroom.address.country}
                </p>
                <p className="text-body-md text-gray-800">
                  <span className="font-medium">Managers:</span>{" "}
                  {classroom.managerIds.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClassroomManagement;
