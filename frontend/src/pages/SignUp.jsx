import { register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Img1 from "../assets/bg.png";
import { Container, Title } from "../router/index";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [frimiAccountNumber, setFrimiAccountNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (role !== "Auctioneer") {
      setBankAccountName("");
      setBankAccountNumber("");
      setBankName("");
      setFrimiAccountNumber("");
      setPaypalEmail("");
    }
  }, [role]);

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);
    
    if (role === "Auctioneer") {
      formData.append("bankAccountName", bankAccountName);
      formData.append("bankAccountNumber", bankAccountNumber);
      formData.append("bankName", bankName);
      formData.append("frimiAccountNumber", frimiAccountNumber);
      formData.append("paypalEmail", paypalEmail);
    }
    
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) navigateTo("/");
  }, [isAuthenticated, navigateTo]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
    reader.readAsDataURL(file);
  };

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
            <Title level={3} className="text-white">Sign Up</Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green-500 font-normal text-xl">Home</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">Sign Up</Title>
            </div>
          </div>
        </Container>
      </div>

      <div className="w-75 bg-white shadow-lg rounded-lg p-8 mt-20 flex flex-col items-center z-10 justify-center">
        <h1 className="text-[#d6482b] text-4xl font-bold mb-2">Register</h1>
        
        <form className="flex flex-col gap-5 w-full px-4" onSubmit={handleRegister}>
          <p className="font-semibold text-2xl">Personal Details</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-stone-600">Full Name *</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-stone-600">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-stone-600">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-stone-600">Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-stone-600">Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Role</option>
                <option value="Auctioneer">Auctioneer</option>
                <option value="Bidder">Bidder</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-stone-600">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-stone-600">Profile Image</label>
            <div className="flex items-center gap-3">
              <img
                src={profileImagePreview || "/imageHolder.jpg"}
                alt="Profile preview"
                className="w-14 h-14 rounded-full object-cover"
              />
              <input 
                type="file" 
                onChange={imageHandler} 
                accept="image/*"
                className="file-input"
              />
            </div>
          </div>

          {role === "Auctioneer" && (
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-2xl">
                Payment Method Details *
                <span className="block text-sm text-stone-500 font-normal mt-1">
                  Required for Auctioneer registration
                </span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-stone-600">Bank Name *</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="Sampath Bank">Sampath Bank</option>
                    <option value="BOC Bank">BOC Bank</option>
                    <option value="People's Bank">People's Bank</option>
                    <option value="HNB Bank">HNB Bank</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-stone-600">Bank Account Number *</label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-stone-600">Account Holder Name *</label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-stone-600">Frimi Account Number *</label>
                  <input
                    type="text"
                    value={frimiAccountNumber}
                    onChange={(e) => setFrimiAccountNumber(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-stone-600">PayPal Email *</label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button
            className="bg-[#d6482b] w-full max-w-[420px] lg:max-w-[640px] font-semibold hover:bg-[#b8381e] transition-all duration-300 text-xl py-2 px-4 rounded-md text-white mx-auto my-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-700 mt-6">
          Already have an account? <Link to="/login" className="text-[#d6482b]">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;

// Add this CSS in your global styles or as a CSS module
// .input-field {
//   @apply w-full py-2 bg-transparent border-b-2 border-stone-300 focus:outline-none focus:border-[#d6482b];
// }

// .file-input {
//   @apply file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#d6482b] file:text-white hover:file:bg-[#b8381e];
// }