import React, { useState,useEffect } from "react";
import axios from "axios";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    label: "exam",
    start: "",
    end: "",
    description: "",
  });

  const getFormattedDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

    const handleAddEvent = async () => {
  if (formData.title && formData.start) {
    const start = new Date(formData.start);
    const end = formData.end ? new Date(formData.end) : start;

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      const eventDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const eventPayload = {
        ...formData,
        start: eventDate,
      };

      try {
        await axios.post("http://localhost:5000/api/events", eventPayload);
      } catch (err) {
        console.error("❌ Failed to add event:", err.response?.data || err.message);
        alert("Failed to save event to server.");
      }
    }

    
    try {
      const refreshed = await axios.get("http://localhost:5000/api/events");
      setEvents(refreshed.data);
    } catch (err) {
      console.error("Failed to fetch updated events:", err);
    }

    
    setShowForm(false);
    setFormData({ title: "", label: "exam", start: "", end: "", description: "" });
  }
};



  const generateCalendarTable = (isSmall = false) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let rows = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      let cells = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > daysInMonth) {
          cells.push(
            <td
              key={j}
              className={`border rounded bg-white ${isSmall ? "h-[40px]" : "h-[80px]"} p-1`}
            ></td>
          );
        } else {
          const thisDate = getFormattedDate(year, month, day);
          const dayEvents = events.filter((e) => e.start === thisDate);

          cells.push(
            <td
              key={j}
              className={`border rounded bg-white ${isSmall ? "h-[40px]" : "h-[80px]"} p-1 overflow-hidden align-top`}
            >
              <div className="font-medium text-xs">{day}</div>
              <div className={`space-y-0.5 ${isSmall ? "mt-1" : ""}`}>
                {dayEvents.map((e, idx) => (
                  <div
                    key={idx}
                    className={`w-full px-1 py-0.5 text-[10px] rounded truncate whitespace-nowrap overflow-hidden text-ellipsis ${
                      e.label === "exam" ? "bg-cyan-200" : "bg-blue-200"
                    } ${isSmall ? "text-[8px]" : ""}`}
                    title={e.title}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </td>
          );
          day++;
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }

    useEffect(() => {
     const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
     }
   }, []);

          useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events from backend:", err);
    }
  };

  fetchEvents();
}, []);






    return (
      <table className="w-full table-fixed text-[11px] sm:text-xs text-gray-700 text-center border-separate border-spacing-[2px]">
        <thead>
          <tr className="text-gray-500">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">
      

        <aside className="bg-white w-full xl:w-[300px] flex-shrink-0 rounded-md shadow p-5 space-y-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white font-semibold py-2 rounded-md text-sm"
          >
            + New Events
          </button>

          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-semibold text-gray-700">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="space-x-2">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  &lt;
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  &gt;
                </button>
              </div>
            </div>
            <div>{generateCalendarTable(true)}</div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Event Label</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" /> <span>Holidays</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-cyan-500" defaultChecked /> <span>Exam</span>
              </div>
            </div>
          </div>
        </aside>

      
        <section className="flex-1 bg-white rounded-md shadow p-6 overflow-x-auto xl:min-h-[750px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &lt;
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &gt;
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div></div>
          </div>
          <div>{generateCalendarTable()}</div>
        </section>
      </div>

      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Add Event</h3>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event Title"
              className="w-full border rounded p-2"
            />
            <select
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full border rounded p-2"
            >
              <option value="exam">Exam</option>
              <option value="holiday">Holiday</option>
            </select>
            <input
              type="date"
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              className="w-full border rounded p-2"
            />
            <input
              type="date"
              value={formData.end}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              className="w-full border rounded p-2"
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              className="w-full border rounded p-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 rounded bg-cyan-500 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Events;










