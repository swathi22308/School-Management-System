

// import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
// import Layout from "./Layout";
// import Dashboard from "./DashBoard";
// import Students from "./Student";
// import Staff from "./Staff";
// import Events from "./Events";
// import StudentStandard from "./StudentStandard";
// import StaffRole from "./StaffRole";
// import EventLabel from "./EventLabel";
// import Login from "./Login";
// import StudentProfile from "./StudentProfile";

// function App() {
//   return (
//     <Router>
//       <Routes>



//                   <Route path="/" element={<Login />} />
              


//         <Route path="/layout" element={<Layout />}>
//         <Route index element={<Navigate to="/dashboard" />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="students" element={<Students />} />
//           <Route path="staff" element={<Staff />} />
//           <Route path="events" element={<Events />} />
//           <Route path="students/:id" element={<StudentProfile />} />

//           {/* Master Nested Routes */}
//           <Route path="master">
//             <Route path="standard" element={<StudentStandard />} />
//             <Route path="staff" element={<StaffRole />} />
//             <Route path="event" element={<EventLabel />} />
//           </Route>
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from 'react'
import MissingSkills from './MissingSkills'

function App() {
  return (
    <div><MissingSkills/></div>
  )
}

export default App