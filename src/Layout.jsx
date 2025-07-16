import { useLocation, useNavigate,Link ,Outlet} from "react-router-dom";
import { Calendar, Users, BookUser, LayoutDashboard, Settings } from "lucide-react";
import { useState } from "react";
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); 

  const isMasterPage = location.pathname.startsWith("/layout/master");

  const handleRadioChange = (e) => {
    navigate(`/layout/master/${e.target.value}`);
  };

  const handleLogout = () => {
    
    navigate("/"); 
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      

      <header className="w-full bg-cyan-500 text-white px-6 py-4 flex items-center justify-between shadow relative">
        <div></div>

        <div className="relative">
          <img
            src="src/assets/profile2.jpeg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)} 
          />

          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>{" "}
      <div className="flex flex-1 overflow-hidden">
      
        <aside className="w-64 bg-white shadow-md p-4 space-y-4">
           

          <Link
            to="/layout/dashboard"
            className={`flex items-center gap-2 hover:bg-cyan-100 rounded-md ${
              location.pathname === "/layout/dashboard"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            to="/layout/students"
            className={`flex items-center gap-2 hover:bg-cyan-100 rounded-md ${
              location.pathname === "/layout/students"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            <BookUser className="w-5 h-5" /> Students
          </Link>
          <Link
            to="/layout/staff"
            className={`flex items-center gap-2 hover:bg-cyan-100 rounded-md ${
              location.pathname === "/layout/staff"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            <Users className="w-5 h-5" /> Staff
          </Link>
          <Link
            to="/layout/events"
            className={`flex items-center gap-2 hover:bg-cyan-100 rounded-md ${
              location.pathname === "/layout/events"
                ? "text-blue-600"
                : "text-gray-700"
            }`}
          >
            <Calendar className="w-5 h-5" /> Events
          </Link>

        

          <div>
            <Link
              to="/layout/master/standard"
              className={`flex items-center gap-2 hover:bg-cyan-100 rounded-md ${
                isMasterPage ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <Settings className="w-5 h-5" /> Masters
            </Link>

            {isMasterPage && (
              <div className="ml-6 mt-2 space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    value="standard"
                    checked={location.pathname === "/layout/master/standard"}
                    onChange={handleRadioChange}
                    className="accent-cyan-500"
                  />
                  <span>Student Standard</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    value="staff"
                    checked={location.pathname === "/layout/master/staff"}
                    onChange={handleRadioChange}
                    className="accent-cyan-500"
                  />
                  <span>Staff Role</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    value="event"
                    checked={location.pathname === "/layout/master/event"}
                    onChange={handleRadioChange}
                    className="accent-cyan-500"
                  />
                  <span>Event Label</span>
                </label>
              </div>
            )}
          </div>
        </aside>

      
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
