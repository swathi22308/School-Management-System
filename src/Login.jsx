import { useState } from "react";
import { IoMail } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/logins", {
        email,
        password,
      });

      if (res.data.success) {
        alert("✅ You logged in successfully!");
        navigate("/layout/dashboard");
      } else {
        alert("❌ Login failed: " + res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white bg-opacity-90 text-black p-8 rounded-xl shadow-lg border border-gray-200"
      >
        <h1 className="text-2xl font-bold font-serif text-center mb-6 text-cyan-600">
          Login Page
        </h1>

    
        <div className="relative mb-5">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-md border border-cyan-500 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <IoMail className="absolute top-1/2 right-3 transform -translate-y-1/2 text-cyan-500" />
        </div>


        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-md border border-cyan-500 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          {showPassword ? (
            <FaEye
              onClick={togglePasswordView}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-cyan-500 cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={togglePasswordView}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-cyan-500 cursor-pointer"
            />
          )}
        </div>

        <div className="text-right mb-4">
          <Link
            to="/Forgot"
            className="text-sm text-cyan-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-md transition-all duration-300"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
