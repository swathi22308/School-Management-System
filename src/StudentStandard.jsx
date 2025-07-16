import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const StudentStandard = () => {
  const [standards, setStandards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStandard, setEditStandard] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchStandards = async () => {
    const res = await axios.get("/api/masters");
    setStandards(res.data.filter((item) => item.type === "standard"));
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const openModal = (standard = null) => {
    if (standard) {
      setEditStandard(standard);
      setName(standard.name);
      setStatus(standard.status);
    } else {
      setEditStandard(null);
      setName("");
      setStatus("Active");
    }
    setModalOpen(true);
  };

  const saveStandard = async () => {
    const payload = { name, status, type: "standard" };

    try {
      if (editStandard) {
        await axios.put(`/api/masters/${editStandard._id}`, payload);
      } else {
        await axios.post("/api/masters", payload);
      }
      setModalOpen(false);
      fetchStandards();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStandard = async (id) => {
    if (window.confirm("Are you sure you want to delete this standard?")) {
      await axios.delete(`/api/masters/${id}`);
      fetchStandards();
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStandards = standards.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold">Student Standards</h2>
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
              <th className="px-4 py-3 whitespace-nowrap">Standard Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStandards.map((standard, idx) => (
              <tr key={standard._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{startIdx + idx + 1}</td>
                <td className="px-4 py-3">{standard.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${
                      standard.status === "Active" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {standard.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => openModal(standard)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                    </button>
                    <button onClick={() => deleteStandard(standard._id)} title="Delete">
                      <TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 text-sm text-gray-600 gap-2">
          <span>
            Showing {startIdx + 1} to{" "}
            {Math.min(startIdx + itemsPerPage, standards.length)} of{" "}
            {standards.length} entries
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
              disabled={startIdx + itemsPerPage >= standards.length}
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
              {editStandard ? "Edit Standard" : "Add Standard"}
            </h2>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Enter Standard"
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
                onClick={saveStandard}
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

export default StudentStandard;

