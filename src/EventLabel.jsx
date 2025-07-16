import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const colorOptions = [
  "#ff0000",
  "#00ffff",
  "#00ff00",
  "#ffa500",
  "#ff69b4",
  "#800080",
  "#0000ff",
  "#ffc107",
  "#ff00ff",
  "#4caf50",
];

const EventLabel = () => {
  const [eventLabels, setEventLabels] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLabel, setEditLabel] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [status, setStatus] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const res = await axios.get("/api/masters");
      setEventLabels(res.data.filter((item) => item.type === "eventLabel"));
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (label = null) => {
    if (label) {
      setEditLabel(label);
      setName(label.name);
      setColor(label.color);
      setStatus(label.status);
    } else {
      setEditLabel(null);
      setName("");
      setColor("#ff0000");
      setStatus("Active");
    }
    setModalOpen(true);
  };

  const saveLabel = async () => {
    const payload = { name, color, status, type: "eventLabel" };
    try {
      if (editLabel) {
        await axios.put(`/api/masters/${editLabel._id}`, payload);
      } else {
        await axios.post("/api/masters", payload);
      }
      setModalOpen(false);
      fetchLabels();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLabel = async (id) => {
    if (window.confirm("Are you sure you want to delete this label?")) {
      await axios.delete(`/api/masters/${id}`);
      fetchLabels();
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedLabels = eventLabels.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold">Event Labels</h2>
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
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Event Label Name</th>
              <th className="px-4 py-3">Label Color</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLabels.map((label, idx) => (
              <tr key={label._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{startIdx + idx + 1}</td>
                <td className="px-4 py-3">{label.name}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${
                      label.status === "Active" ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    {label.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(label)} title="Edit">
                      <PencilSquareIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                    </button>
                    <button
                      onClick={() => deleteLabel(label._id)}
                      title="Delete"
                    >
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
            Showing {startIdx + 1} to{" "}
            {Math.min(startIdx + itemsPerPage, eventLabels.length)} of{" "}
            {eventLabels.length} entries
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
              disabled={startIdx + itemsPerPage >= eventLabels.length}
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
              {editLabel ? "Edit Event Label" : "Add Event Label"}
            </h2>
            <div>
              <label className="text-sm">Event Label Name</label>
              <input
                className="w-full border p-2 rounded text-sm mt-1"
                placeholder="Enter Event Label Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Event Label Color</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((col) => (
                  <div
                    key={col}
                    className={`w-6 h-6 rounded cursor-pointer border-2 ${
                      color === col ? "border-black" : "border-transparent"
                    }`}
                    style={{ backgroundColor: col }}
                    onClick={() => setColor(col)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm">Status</label>
              <select
                className="w-full border p-2 rounded text-sm mt-1"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveLabel}
                className="px-4 py-1 bg-cyan-500 text-white rounded text-sm"
              >
                {editLabel ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventLabel;
