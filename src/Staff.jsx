import { useState,useEffect } from 'react';
import { Eye, Edit, Trash2, Save } from 'lucide-react';
import axios from 'axios';
import AddStaffForm from './AddStaffForm';

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [hiddenRows, setHiddenRows] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData({ ...staffs[index] });
  };


  

    const handleSaveClick = async () => {
  const updatedStaff = { ...editData };

  try {
    await axios.put(`/api/staffs/${updatedStaff.id}`, updatedStaff);

    const updated = [...staffs];
    updated[editIndex] = updatedStaff;
    setStaffs(updated);
    setEditIndex(null);
  } catch (err) {
    console.error("Error updating student:", err);
    alert("Failed to update student on server.");
  }
};





   const handleDelete = async (id) => {
  if (confirm("Are you sure you want to delete this staff?")) {
    try {
      await axios.delete(`/api/staffs/${id}`);
      setStaffs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting staff:", err);
      alert("Failed to delete staff on server.");
    }
  }
};


  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };


  const handleAddStaff = async () => {
    try {
      const res = await axios.get("/api/staffs");
      if (Array.isArray(res.data)) {
        setStaffs(res.data);
      }
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to fetch updated staff list:", err);
    }
  };



    const filteredStaffs = staffs.filter(
    (staff) =>
      staff &&
      staff.name &&
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const totalPages = Math.ceil(filteredStaffs.length / entriesPerPage);
  const paginatedStudents = filteredStaffs.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );


    useEffect(() => {
    axios
      .get("/api/staffs")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setStaffs(res.data);
        }
      })
      .catch((err) => console.error("Error fetching staffs:", err));
  }, []);


  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md min-h-[650px]">
      {showAddForm ? (
        <AddStaffForm
          onBack={() => setShowAddForm(false)}
          onSave={handleAddStaff}
          existingStaffs={staffs}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-4 gap-2">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded text-sm flex-grow"
              />
              <button
                className="bg-cyan-500 text-white px-4 py-1 rounded"
                onClick={() => setShowAddForm(true)}
              >
                Add Staff
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead className="bg-gray-100">
                <tr>
                  {["S.NO", "Staff ID", "Register Date", "Staff Name", "Standards", "Working Role", "Mobile Number", "Address", "Action"].map((head, i) => (
                    <th key={i} className="py-2 text-left whitespace-nowrap">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((s, index) => {
                  const realIndex = (currentPage - 1) * entriesPerPage + index;
                  const isHidden = hiddenRows.has(realIndex);

                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="py-2 whitespace-nowrap">{realIndex + 1}</td>
                      <td className="py-2 whitespace-nowrap">{s.id}</td>
                      <td className="py-2 whitespace-nowrap">{isHidden ? '-' : s.date}</td>
                      <td className="py-2 whitespace-nowrap">
                        {isHidden ? '-' : (
                          editIndex === realIndex
                            ? <input value={editData.name} onChange={(e) => handleChange('name', e.target.value)} className="border px-2 py-1 rounded w-full" />
                            : s.name
                        )}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        {isHidden ? '-' : (
                          editIndex === realIndex
                            ? <input value={editData.standard} onChange={(e) => handleChange('standard', e.target.value)} className="border px-2 py-1 rounded w-full" />
                            : s.standard
                        )}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        {isHidden ? '-' : (
                          editIndex === realIndex
                            ? <input value={editData.workingRole} onChange={(e) => handleChange('workingRole', e.target.value)} className="border px-2 py-1 rounded w-full" />
                            : s.workingRole
                        )}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        {isHidden ? '-' : (
                          editIndex === realIndex
                            ? <input value={editData.phone} onChange={(e) => handleChange('phone', e.target.value)} className="border px-2 py-1 rounded w-full" />
                            : s.phone
                        )}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        {isHidden ? '-' : (
                          editIndex === realIndex
                            ? <input value={editData.address} onChange={(e) => handleChange('address', e.target.value)} className="border px-2 py-1 rounded w-full" />
                            : s.address
                        )}
                      </td>
                      <td className="py-2 flex gap-2 whitespace-nowrap">
                    
                        {!isHidden && (
                          <>
                            {editIndex === realIndex ? (
                              <Save
                                className="w-4 h-4 text-green-600 cursor-pointer"
                                onClick={handleSaveClick}
                              />
                            ) : (
                              <Edit
                                className="w-4 h-4 text-green-600 cursor-pointer"
                                onClick={() => handleEditClick(realIndex)}
                              />
                            )}
                            <Trash2
                              className="w-4 h-4 text-red-600 cursor-pointer"
                              onClick={() => handleDelete(s.id)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-sm text-gray-500 gap-2">
            <span>
              Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
              {Math.min(currentPage * entriesPerPage, filteredStaffs.length)} of{' '}
              {filteredStaffs.length} Entries
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              <button className="px-3 py-1 bg-cyan-500 text-white rounded">
                {currentPage}
              </button>
              <button
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
