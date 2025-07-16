import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Users, BookUser } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [studentData, setStudentData] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/students").then((res) => {
      setStudentData(res.data);
    });

    axios.get("/api/staffs").then((res) => {
      setStaffCount(res.data.length);
    });

    axios.get("/api/events").then((res) => {
      setEvents(res.data);
    });
  }, []);

  const studentChartData = Array.from(
    new Set(studentData.map((s) => s.standard.trim()))
  )
    .sort()
    .map((standard) => {
      const boys = studentData.filter(
        (s) =>
          s.standard.trim() === standard &&
          s.gender.trim().toLowerCase() === "male"
      ).length;
      const girls = studentData.filter(
        (s) =>
          s.standard.trim() === standard &&
          s.gender.trim().toLowerCase() === "female"
      ).length;
      return { grade: standard, Male: boys, Female: girls };
    });

  const groupedEvents = events.reduce((acc, curr) => {
    const day = new Date(curr.start).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BookUser className="text-cyan-400" />
              <div>
                <div className="text-sm">Total Students</div>
                <div className="text-2xl font-bold">{studentData.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="text-yellow-400" />
              <div>
                <div className="text-sm">Total Staff</div>
                <div className="text-2xl font-bold">{staffCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="text-green-400" />
              <div>
                <div className="text-sm">Events</div>
                <div className="text-2xl font-bold">{events.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-4">Students Status</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentChartData}>
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Male" fill="#00BCD4" />
                <Bar dataKey="Female" fill="#E91E63" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-4">Upcoming Events</div>
            <div className="space-y-4">
              {Object.entries(groupedEvents).map(([day, events]) => (
                <div key={day}>
                  <div className="font-medium text-sm mb-1">{day}</div>
                  <div className="space-y-1">
                    {events.map((e, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center px-3 py-1 rounded text-white ${
                          e.label === "holiday" ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {/* <span>
                          {new Date(e.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span> */}
                        <span>
                          {new Date(
                            new Date(e.start).setHours(9, 0, 0, 0)
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>

                        <span>{e.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
