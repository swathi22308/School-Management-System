import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const StaffRole = () => {
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRoles = async () => {
    const res = await axios.get("/api/masters");
    setRoles(res.data.filter((item) => item.type === "staffrole"));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openModal = (role = null) => {
    if (role) {
      setEditRole(role);
      setName(role.name);
      setStatus(role.status);
    } else {
      setEditRole(null);
      setName("");
      setStatus("Active");
    }
    setModalOpen(true);
  };

  const saveRole = async () => {
    const payload = { name, status, type: "staffrole" };

    try {
      if (editRole) {
        await axios.put(`/api/masters/${editRole._id}`, payload);
      } else {
        await axios.post("/api/masters", payload);
      }
      setModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await axios.delete(`/api/masters/${id}`);
      fetchRoles();
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = roles.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold">Staff Roles</h2>
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm"
          onClick={() => openModal()}
        >
          + Add
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">S.No</th>
              <th className="px-4 py-3 whitespace-nowrap">Staff Role</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.map((role, idx) => (
              <tr key={role._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{startIdx + idx + 1}</td>
                <td className="px-4 py-3 font-medium">{role.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${
                      role.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {role.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => openModal(role)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => deleteRole(role._id)} title="Delete">
                      <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 text-sm text-gray-600 gap-2">
          <span>
            Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, roles.length)} of {roles.length} entries
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={startIdx + itemsPerPage >= roles.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

  
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] sm:w-96 p-6 rounded shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">
              {editRole ? "Edit Staff Role" : "Add Staff Role"}
            </h2>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Enter Staff Role"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="w-full border p-2 rounded text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveRole}
                className="px-3 py-1 bg-cyan-500 text-white rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRole;
