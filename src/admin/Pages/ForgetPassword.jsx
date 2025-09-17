import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import logo from '../assets/logo/logo_hr.png';
import lockImage from '../assets/login/login side img.webp';
import icon from '../assets/login/icon.webp';
import '../Styles/login.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSendResetLink = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    toast.success('Password reset link sent to your email!');
    setEmail('');
    setShowResetModal(true); // Show password reset modal
  };

  const handlePasswordUpdate = () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    toast.success('Password updated successfully!');
    setShowResetModal(false);
    setNewPassword('');
    setConfirmPassword('');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      {/* Header */}
      <header className="login-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className="login-header-right">
          <span>Remember your password?</span>
          <Link to="/login">
            <button className="signup-btn">Login</button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Image Side */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center bg-gray-50">
          <img src={lockImage} alt="Illustration" className="w-3/4 max-w-md" />
        </div>

        {/* Form Side */}
        <div className="flex flex-1 justify-center items-center px-4 py-12">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <img src={icon} alt="icon" className="h-12" />
            </div>

            <h2 className="text-xl font-semibold text-center mb-2">Forgot Your Password?</h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Enter your email address and we’ll send you a link to reset your password.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-blue-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSendResetLink}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>

            <div className="mt-6 text-center text-xs text-gray-500">
              <a href="#" className="hover:underline">Terms of Service</a> & <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </main>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Set New Password</h3>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300  bg-white rounded focus:outline-none"
            />

            <div className="flex gap-4">
              <button
                onClick={handlePasswordUpdate}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Update Password
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
