import React from "react";
import './index.css'; 
import {
  Card,
  CardContent
} from "./card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, Users, BookUser, LayoutDashboard } from "lucide-react";

const data = [
  { grade: "8th", Boy: 1200, Girl: 1900 },
  { grade: "9th", Boy: 1800, Girl: 700 },
  { grade: "10th", Boy: 1900, Girl: 1900 },
  { grade: "11th", Boy: 400, Girl: 900 },
  { grade: "12th", Boy: 2200, Girl: 1300 }
];

const events = [
  { day: "Wednesday 21", events: [
    { time: "9:00 AM", name: "Exam", color: "bg-green-500" },
    { time: "2:00 PM", name: "Sports Day", color: "bg-red-500" }
  ]},
  { day: "Thursday 22", events: [
    { time: "9:00 AM", name: "Exam", color: "bg-green-500" },
    { time: "2:00 PM", name: "Exam", color: "bg-green-500" }
  ]},
  { day: "Friday 23", events: [
    { time: "9:00 AM", name: "Exam", color: "bg-green-500" }
  ]}
];

export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      
      {/* Header - Full Width */}
      <header className="w-full bg-cyan-500 text-white px-6 py-4 flex items-center justify-between shadow">
        <div></div>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-gray-300 "
        />
      </header>

      {/* Content Area - Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
         
          <nav className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <LayoutDashboard className="w-5 h-5" /> Dash Board
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <BookUser className="w-5 h-5" /> Students
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5" /> Staff
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5" /> Events
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <LayoutDashboard className="w-5 h-5" /> Masters
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BookUser className="text-cyan-400" />
                  <div>
                    <div className="text-sm">Total Students</div>
                    <div className="text-2xl font-bold">2300</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="text-yellow-400" />
                  <div>
                    <div className="text-sm">Total Staff</div>
                    <div className="text-2xl font-bold">23</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="text-green-400" />
                  <div>
                    <div className="text-sm">Events</div>
                    <div className="text-2xl font-bold">113</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold mb-4">Students Status</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Boy" fill="#00BCD4" />
                    <Bar dataKey="Girl" fill="#E91E63" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold mb-4">Events</div>
                <div className="space-y-4">
                  {events.map((day, idx) => (
                    <div key={idx}>
                      <div className="font-medium text-sm mb-1">{day.day}</div>
                      <div className="space-y-1">
                        {day.events.map((e, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center px-3 py-1 rounded text-white ${e.color}`}
                          >
                            <span>{e.time}</span>
                            <span>{e.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
