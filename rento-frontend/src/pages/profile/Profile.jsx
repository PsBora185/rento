import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Building2, Shield, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, emailVerified, sendEmailOtp, verifyEmailOtp, logout } = useAuth();
  const navigate = useNavigate();
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleSendEmailOtp = async () => {
    if (!user?.email) {
      toast.error('No email address found');
      return;
    }
    
    setVerifyingEmail(true);
    const result = await sendEmailOtp(user.email);
    setVerifyingEmail(false);
    
    if (result.success) {
      setOtpSent(true);
    }
  };

  const handleVerifyEmail = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    const result = await verifyEmailOtp(user.email, otp);
    setVerifyingOtp(false);

    if (result.success) {
      setOtpSent(false);
      setOtp('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-blue-100">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{user?.email}</div>
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium">{user?.phone}</div>
                </div>
              </div>
            )}

            {user?.city && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-medium">
                    {user?.city}{user?.state && `, ${user?.state}`}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Account Type</div>
                <div className="font-medium">
                  {user?.role === 'OWNER' ? 'Property Owner' : 'Renter'}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification Status
            </h3>
            <div className="space-y-3">
              {/* Email Verification */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">Email Verification</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    emailVerified 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {emailVerified ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
                
                {!emailVerified && (
                  <div className="space-y-3">
                    {!otpSent ? (
                      <Button
                        onClick={handleSendEmailOtp}
                        loading={verifyingEmail}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Send Verification OTP
                      </Button>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          Enter the OTP sent to {user?.email}
                        </p>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            maxLength="6"
                            className="flex-1"
                          />
                          <Button
                            onClick={handleVerifyEmail}
                            loading={verifyingOtp}
                            size="sm"
                          >
                            Verify
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Phone Verification */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Phone Verification</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  user?.phoneVerified 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {user?.phoneVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Pending
                    </>
                  )}
                </span>
              </div>

              {user?.trustScore && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Trust Score</span>
                  <span className="font-semibold text-primary-600">
                    {user.trustScore}/100
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Account
        </h3>
        <Button
          fullWidth
          variant="danger"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;