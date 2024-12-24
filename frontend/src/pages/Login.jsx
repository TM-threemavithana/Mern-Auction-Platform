import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-100 to-gray-300 px-5 py-20">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-[#d6482b] mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d6482b] transition duration-300"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#d6482b] transition duration-300"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white font-semibold rounded transition duration-300 ${
              loading
                ? "bg-[#b8381e] cursor-not-allowed"
                : "bg-[#d6482b] hover:bg-[#b8381e]"
            }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
