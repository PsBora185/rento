import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, MapPin, Shield, Search, Home as HomeIcon, Users, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import Button from '../../components/common/Button';
import Navbar from '../../components/common/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const redirectPath = user?.role === 'OWNER' ? '/owner/dashboard' : '/rooms';
      navigate(redirectPath);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/20">
              <p className="text-sm font-semibold text-blue-100">🚀 Welcome to the Future of Renting</p>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Find Your Perfect Room <br className="hidden sm:block" /> with <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">Rento</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-10 font-light">
              The trusted platform connecting renters with verified property owners across India. Your perfect home is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleGetStarted}
                icon={Search}
                className="px-8 py-3 text-lg"
              >
                {isAuthenticated ? 'Browse Rooms' : 'Get Started'}
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="text-white border-2 border-white hover:bg-white/20 px-8 py-3 text-lg transition-all"
                >
                  Sign In
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">10K+</div>
                <p className="text-blue-100 text-sm">Happy Renters</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">5K+</div>
                <p className="text-blue-100 text-sm">Verified Owners</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">50K+</div>
                <p className="text-blue-100 text-sm">Active Listings</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gradient-to-b from-blue-50 via-blue-50/50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Rento?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands. Secure, transparent, and designed for both renters and owners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified Owners</h3>
              <p className="text-gray-600 leading-relaxed">
                All property owners undergo thorough verification with ID proof and document validation for your complete safety.
              </p>
              <div className="mt-6 flex items-center text-primary-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                100% Verified
              </div>
            </div>

            <div className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Location Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find rooms near your workplace, college, or preferred location using our advanced GPS-powered search.
              </p>
              <div className="mt-6 flex items-center text-green-600 font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Instant Results
              </div>
            </div>

            <div className="group bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HomeIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Massive Selection</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through thousands of rooms with detailed photos, amenities, and completely transparent pricing.
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-semibold">
                <TrendingUp className="w-5 h-5 mr-2" />
                Always Growing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent steps to find or list your perfect room
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Renters */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl opacity-20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 p-12 rounded-3xl border border-blue-200 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">For Renters</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      1
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Create Account</h4>
                      <p className="text-gray-600 leading-relaxed">Sign up in seconds with your email and phone number</p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      2
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Search & Filter</h4>
                      <p className="text-gray-600 leading-relaxed">Find rooms by location, price, amenities, and more</p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      3
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Connect & Move In</h4>
                      <p className="text-gray-600 leading-relaxed">Chat with verified owners and book your perfect room</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* For Owners */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl opacity-20 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-green-50 to-green-100/50 p-12 rounded-3xl border border-green-200 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">For Owners</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      1
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Register & Verify</h4>
                      <p className="text-gray-600 leading-relaxed">Create your owner account and complete verification</p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      2
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">List Your Rooms</h4>
                      <p className="text-gray-600 leading-relaxed">Add photos, details, amenities, and set your price</p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      3
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Get Tenants</h4>
                      <p className="text-gray-600 leading-relaxed">Receive inquiries from qualified and interested renters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl transform translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to Find Your <br className="hidden sm:block" /> Perfect Room?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 font-light max-w-2xl mx-auto">
            Join thousands of happy renters and owners on Rento today. Your next home is waiting!
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={handleGetStarted}
              className="px-10 py-4 text-lg font-semibold"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Rento</span>
              </div>
              <p className="text-sm text-gray-500">Your trusted platform for finding the perfect room across India.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Renters</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Browse Rooms</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Owners</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">List Your Room</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Owner Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">© 2024 Rento. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.096-1.645-.145-2.748-.145-4.364 0-7.4 2.657-7.4 7.536v1.609z"></path></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"></path></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;