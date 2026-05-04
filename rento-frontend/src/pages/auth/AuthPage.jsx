import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { authAPI } from '../../api/auth.api';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // LOGIN FORM STATE
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  // SIGNUP FORM STATE
  const [signupData, setSignupData] = useState({
    name: '',
    identifier: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const res = await login(loginData);
    setLoading(false);

    if (res.success) {
      toast.success('Login successful!');
      setTimeout(() => {
        const target = res.user?.role === 'OWNER' ? '/owner/dashboard' : '/rooms';
        navigate(target, { replace: true });
      }, 500);
    } else {
      toast.error(res.message || 'Login failed');
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!signupData.identifier) {
      toast.error('Enter email or phone');
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendOtp({ identifier: signupData.identifier });
      toast.success('OTP sent to your email/phone');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    if (!signupData.otp) {
      toast.error('Enter OTP');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOtp({
        identifier: signupData.identifier,
        otp: signupData.otp,
      });
      toast.success('OTP verified');
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGNUP SUBMIT =================
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.name || !signupData.identifier || !signupData.password) {
      toast.error('Please fill all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      toast.error('Password is too weak');
      return;
    }

    if (!otpVerified) {
      toast.error('Please verify OTP first');
      return;
    }

    setLoading(true);
    // Determine if identifier is email or phone and send separate fields
    const isEmail = signupData.identifier.includes('@');
    const res = await signup({
      name: signupData.name,
      email: isEmail ? signupData.identifier : null,
      phone: !isEmail ? signupData.identifier : null,
      password: signupData.password,
    });
    setLoading(false);

    if (res.success) {
      toast.success('Account created! Redirecting...');
      setTimeout(() => {
        navigate('/select-role', { replace: true });
      }, 500);
    } else {
      toast.error(res.message || 'Signup failed');
    }
  };

  // ================= PASSWORD STRENGTH CALCULATOR =================
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-neutral-300';
    if (passwordStrength === 1) return 'bg-error';
    if (passwordStrength === 2) return 'bg-warning';
    if (passwordStrength === 3) return 'bg-accent-400';
    return 'bg-accent';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated gradient background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo / Brand Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">RENTO</span>
          </div>
          <p className="text-neutral-600 text-sm font-medium">Find your next perfect room</p>
        </div>

        {/* Glass Morphism Card */}
        <div className="glass-card p-8 backdrop-blur-xl border border-white/20 shadow-xl">
          {/* Tab Switcher */}
          <div className="flex gap-4 mb-8 animate-fade-in animation-delay-100">
            <button
              onClick={() => {
                setIsLogin(true);
                setOtpSent(false);
                setOtpVerified(false);
              }}
              className={`flex-1 pb-3 font-semibold text-sm transition-all duration-300 relative ${
                isLogin ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
              }`}
              aria-label="Switch to login"
            >
              Login
              {isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-slide-left animation-duration-300"></div>
              )}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setOtpSent(false);
                setOtpVerified(false);
              }}
              className={`flex-1 pb-3 font-semibold text-sm transition-all duration-300 relative ${
                !isLogin ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
              }`}
              aria-label="Switch to signup"
            >
              Sign Up
              {!isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-slide-right animation-duration-300"></div>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent mb-8"></div>

          {/* LOGIN FORM */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="animate-fade-in animation-delay-200">
                <Input
                  type="text"
                  placeholder="Email or Phone"
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                  icon={Mail}
                  aria-label="Email or phone"
                />
              </div>

              <div className="animate-fade-in animation-delay-300">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    icon={Lock}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right animate-fade-in animation-delay-400">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="animate-fade-in animation-delay-500 mt-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold"
              >
                {loading ? 'Processing...' : 'Login'}
              </Button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="animate-fade-in animation-delay-200">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  icon={User}
                />
              </div>

              <div className="animate-fade-in animation-delay-300">
                <Input
                  type="text"
                  placeholder="Email or Phone"
                  value={signupData.identifier}
                  onChange={(e) => setSignupData({ ...signupData, identifier: e.target.value })}
                  disabled={otpSent}
                  icon={Mail}
                />
              </div>

              {otpSent && !otpVerified && (
                <div className="animate-fade-in space-y-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <label className="text-sm font-medium">Enter OTP</label>
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength="1"
                        placeholder="•"
                        className="w-10 h-10 text-center font-bold border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                        value={signupData.otp[i] || ''}
                        onChange={(e) => {
                          const newOtp = signupData.otp.split('');
                          newOtp[i] = e.target.value;
                          setSignupData({ ...signupData, otp: newOtp.join('') });
                          if (e.target.value && i < 5) {
                            e.target.nextElementSibling?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  <Button type="button" onClick={handleVerifyOtp} fullWidth className="bg-accent text-white">
                    Verify OTP
                  </Button>
                  <button type="button" onClick={handleSendOtp} className="w-full text-sm text-primary-600">
                    Resend
                  </button>
                </div>
              )}

              {!otpSent && (
                <Button type="button" onClick={handleSendOtp} fullWidth className="animate-fade-in animation-delay-400 bg-accent text-white">
                  Send OTP
                </Button>
              )}

              {otpVerified && (
                <>
                  <div className="animate-fade-in">
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={signupData.password}
                        onChange={(e) => {
                          setSignupData({ ...signupData, password: e.target.value });
                          calculatePasswordStrength(e.target.value);
                        }}
                        icon={Lock}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {signupData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                i < passwordStrength ? getStrengthColor() : 'bg-neutral-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p className="text-xs text-neutral-600">
                          {passwordStrength === 1 && 'Weak'}
                          {passwordStrength === 2 && 'Fair'}
                          {passwordStrength === 3 && 'Good'}
                          {passwordStrength === 4 && 'Strong'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="animate-fade-in">
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        icon={Lock}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="animate-fade-in mt-6 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </>
              )}
            </form>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-6"></div>

          <p className="text-center text-sm text-neutral-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setOtpSent(false);
                setOtpVerified(false);
              }}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-neutral-600 animate-fade-in animation-delay-700">
          <p>✓ Secure • ✓ Fast • ✓ Trusted</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;