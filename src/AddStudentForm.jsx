import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddStudentForm({ onSave, onBack, existingStudents }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    standard: "",
    gender: "",
    parent: "",
    phone: "",
    altPhone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    profile: null,
  });

  
  useEffect(() => {
    
    const lastNumericId =
      existingStudents
        .map((s) => parseInt(s.id.replace("RS", "")))
        .filter((n) => !isNaN(n))
        .sort((a, b) => b - a)[0] || 2025000;

    const newId = `RS${lastNumericId + 1}`;
    setFormData((prev) => ({ ...prev, id: newId }));
  }, [existingStudents]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append("date", new Date().toLocaleDateString());

    try {
      await axios.post(`${API_BASE_URL}/students`, data); 

      alert("Student saved successfully!");
      onSave(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save student.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Student</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1 text-sm">Student ID</label>
          <input
            name="id"
            value={formData.id}
            disabled
            className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Student Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Standard</label>
          <select
            name="standard"
            value={formData.standard}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 px-3 py-2 rounded"
          >
            <option value="">Select Standard</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 px-3 py-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Parent Name</label>
          <input
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Mobile Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Alternate Mobile Number</label>
          <input
            name="altPhone"
            value={formData.altPhone}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Upload Profile</label>
          <input
            type="file"
            name="profile"
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Landmark</label>
          <input
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">State</label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border border-gray-700 px-3 py-2 rounded"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save →
          </button>
        </div>
      </form>
    </div>
  );
}
