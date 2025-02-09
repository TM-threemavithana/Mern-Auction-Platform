import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Img1 from "../assets/bg.png";
import { Container, Title } from "../router/index";

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
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-10">
      <div
        className="bg-green w-96 h-10 rounded-full opacity-20 blur-3xl absolute top-1/3 mt-20"
        style={{ backgroundImage: `url(${Img1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden="true"
      ></div>
      <div
        className="bg-[#241C37] pt-8 h-[30vh] relative w-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '30vh',
          backgroundImage: `url(${Img1})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container>
          <div>
            <Title level={3} className="text-white">
              Log In
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green-500 font-normal text-xl">
                Home
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                /
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                Log In
              </Title>
            </div>
          </div>
        </Container>
      </div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 mt-20 flex flex-col items-center z-10 justify-center">
        <h1 className="text-3xl font-extrabold text-center text-[#d6482b] mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-6 w-full">
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
        <p className="text-center text-gray-700 mt-6">
          Don't have an account? <Link to="/sign-up" className="text-[#d6482b]">Sign Up</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;