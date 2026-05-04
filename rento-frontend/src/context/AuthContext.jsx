import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth.api';
import {
  getToken,
  setToken,
  removeToken,
  getUser as getStoredUser,
  setUser as setStoredUser,
} from '../utils/token';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Flag to indicate the user needs to select a role after signup
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  // 🔹 On app load
  useEffect(() => {
    console.log('🔵 AuthProvider mounted, initializing auth');
    initAuth();
  }, []);

  const initAuth = async () => {
    const token = getToken();
    const cachedUser = getStoredUser();

    if (!token || !cachedUser) {
      setLoading(false);
      return;
    }

    try {
      const me = await authAPI.getMe();
      setUser(me);
      setStoredUser(me);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGIN (email OR phone)
  const login = async ({ identifier, password }) => {
    try {
      const res = await authAPI.login({ identifier, password });
      setToken(res.token);
      setUser(res.user);
      setStoredUser(res.user);

      toast.success(`Welcome ${res.user.name}`);
      return { success: true, user: res.user };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  // 🔹 SIGNUP (NO ROLE HERE)
  const signup = async (payload) => {
    try {
      const res = await authAPI.signup(payload);

      setToken(res.token);
      setUser(res.user);
      setStoredUser(res.user);

      // Mark that the user needs to select a role
      setNeedsRoleSelection(true);

      toast.success('Account created successfully!');
      return { success: true, user: res.user };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      toast.error(errorMsg);
      return { success: false };
    }
  };

  // 🔹 UPDATE ROLE
  const updateRole = async (role) => {
    try {
      const updated = await authAPI.updateRole(role);
      setUser(updated);
      setStoredUser(updated);
      // Clear the 'needs role selection' flag when role is set
      setNeedsRoleSelection(false);
      toast.success(`Role updated to ${role}`);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
      return { success: false };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast.success('Logged out');
  };

  // 🔹 VERIFY EMAIL OTP
  const verifyEmailOtp = async (email, otp) => {
    try {
      await authAPI.verifyOtp({ identifier: email, otp });
      // Update user with emailVerified flag
      const updated = await authAPI.getMe();
      setUser(updated);
      setStoredUser(updated);
      toast.success('Email verified successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
      return { success: false };
    }
  };

  // 🔹 SEND EMAIL OTP
  const sendEmailOtp = async (email) => {
    try {
      await authAPI.sendOtp({ identifier: email });
      toast.success('OTP sent to your email');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isOwner: user?.role === 'OWNER',
    isRenter: user?.role === 'RENTER',
    phoneVerified: user?.phoneVerified,
    emailVerified: user?.emailVerified,
    needsRoleSelection,
    login,
    signup,
    logout,
    updateRole,
    verifyEmailOtp,
    sendEmailOtp,
    // Utility to clear the role selection flag (used by skip actions)
    completeRoleSelection: () => setNeedsRoleSelection(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; 
};
