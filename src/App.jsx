import React, { useState, useEffect } from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignIn, 
  SignUp, 
  useUser 
} from '@clerk/clerk-react';
import { ShipmentForm, ShipmentTable } from './components';
import { Package, Clock, Truck, CheckCircle, TrendingUp, Sparkles, BarChart3, Shield, User } from 'lucide-react';
import Header from './components/layout/Header';
import AnalyticsPage from './components/AnalyticsPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

// Main Dashboard Component (User)
const Dashboard = () => {
  const { user } = useUser();
  const { isDark } = useTheme();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'analytics'

  // Real-time listener for shipments
  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const userEmail = user.primaryEmailAddress.emailAddress;
    
    // Create query for user's shipments only
    const q = query(
      collection(db, 'shipments'),
      where('userEmail', '==', userEmail)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shipmentsData = [];
      snapshot.forEach((doc) => {
        shipmentsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('📦 Loaded shipments:', shipmentsData.map(s => ({ 
        id: s.id, 
        tracking: s.trackingNumber 
      })));
      
      // Sort by creation date, newest first
      shipmentsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      setShipments(shipmentsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shipments:", error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  const handleAddShipment = async (newShipment) => {
    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      
      const docRef = await addDoc(collection(db, 'shipments'), {
        ...newShipment,
        userEmail: userEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Shipment added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('❌ Error adding shipment:', error);
      alert('Failed to add shipment. Please try again.');
    }
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      console.log('🔄 Updating status:', { shipmentId, newStatus });
      
      const shipmentRef = doc(db, 'shipments', shipmentId);
      
      await updateDoc(shipmentRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Status updated successfully!');
    } catch (error) {
      console.error('❌ Error updating status:', error);
      console.error('Failed shipment ID:', shipmentId);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDeleteShipment = async (shipmentId) => {
    try {
      console.log('🗑️ Deleting shipment:', shipmentId);
      
      await deleteDoc(doc(db, 'shipments', shipmentId));
      
      console.log('✅ Shipment deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting shipment:', error);
      console.error('Failed shipment ID:', shipmentId);
      alert('Failed to delete shipment. Please try again.');
    }
  };

  const getStatusCounts = () => {
    return {
      total: shipments.length,
      pending: shipments.filter(s => s.status === 'Pending').length,
      inTransit: shipments.filter(s => s.status === 'In Transit').length,
      delivered: shipments.filter(s => s.status === 'Delivered').length
    };
  };

  const getCompletionRate = () => {
    if (shipments.length === 0) return 0;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    return Math.round((delivered / shipments.length) * 100);
  };

  const counts = getStatusCounts();
  const completionRate = getCompletionRate();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        <div className="text-center">
          <div className="relative">
            <Package className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse"></div>
          </div>
          <p className={`text-xl font-light tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Loading your shipments...</p>
        </div>
      </div>
    );
  }

  // Show Analytics Page
  if (currentPage === 'analytics') {
    return (
      <AnalyticsPage 
        shipments={shipments}
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }

  // Show Dashboard
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <Header />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed ${isDark ? 'bg-teal-500/5' : 'bg-teal-500/10'}`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Welcome back, {user?.firstName}
                </h1>
                <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
              </div>
              <p className={`text-lg font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Manage and track your logistics operations
              </p>
            </div>
            
            <div className={`backdrop-blur-sm rounded-2xl border shadow-2xl p-6 min-w-[200px] animate-slide-in-right ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Success Rate</p>
                  <p className="text-3xl font-bold text-emerald-500">{completionRate}%</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentPage('analytics')}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 group"
              >
                <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-emerald-500/10' : 'bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:shadow-emerald-500/20'}`} style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-slate-200 to-slate-300'}`}>
                <Package className={`w-6 h-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700/30' : 'bg-slate-200/50'}`}>
                <span className={`text-2xl font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{counts.total}</span>
              </div>
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Shipments</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{counts.total}</p>
          </div>
          
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-amber-500/50 hover:shadow-amber-500/10' : 'bg-white/80 border-slate-200 hover:border-amber-500/50 hover:shadow-amber-500/20'}`} style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-500">{counts.pending}</span>
              </div>
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Awaiting Dispatch</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{counts.pending}</p>
          </div>
          
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-cyan-500/50 hover:shadow-cyan-500/10' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 hover:shadow-cyan-500/20'}`} style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-cyan-500">{counts.inTransit}</span>
              </div>
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Routes</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{counts.inTransit}</p>
          </div>
          
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-emerald-500/10' : 'bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:shadow-emerald-500/20'}`} style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-500">{counts.delivered}</span>
              </div>
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Completed</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{counts.delivered}</p>
          </div>
        </div>

        <ShipmentForm onAddShipment={handleAddShipment} />
        <ShipmentTable 
          shipments={shipments} 
          onUpdateStatus={handleUpdateStatus}
          onDeleteShipment={handleDeleteShipment}
          readOnly={true}
        />
      </div>
    </div>
  );
};

// Login Type Selection Page
const LoginSelection = ({ onSelectUserLogin, onSelectAdminLogin }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/images/shipping-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-blue-900/40"></div>
      
      <div className="relative z-10 w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-2xl">
              <Package className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-2xl mb-3">
            Shipment Tracker
          </h1>
          <p className="text-blue-100 text-lg drop-shadow-lg">
            Manage your exports with confidence
          </p>
        </div>

        {/* Login Type Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* User Login Card */}
          <button
            onClick={onSelectUserLogin}
            className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white/20 p-10 hover:scale-105 transition-all duration-300 hover:shadow-blue-500/30 text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">User Login</h2>
              <p className="text-slate-600 mb-6">
                Access your personal shipment dashboard and manage your logistics
              </p>
              <div className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                Continue as User
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </button>

          {/* Admin Login Card */}
          <button
            onClick={onSelectAdminLogin}
            className="group bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-red-500/30 p-10 hover:scale-105 transition-all duration-300 hover:shadow-red-500/30 hover:border-red-500/50 text-left"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Admin Portal</h2>
              <p className="text-slate-300 mb-6">
                Access all shipments and manage the entire platform
              </p>
              <div className="inline-flex items-center text-red-400 font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                Admin Access
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Secured by <span className="font-semibold text-white/80">Clerk</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Auth Pages Component
const AuthPages = () => {
  const [loginType, setLoginType] = useState(null); // null, 'user', or 'admin'
  const [isSignUp, setIsSignUp] = useState(false);

  // Show login type selection
  if (loginType === null) {
    return (
      <LoginSelection
        onSelectUserLogin={() => setLoginType('user')}
        onSelectAdminLogin={() => setLoginType('admin')}
      />
    );
  }

  // Show Admin Login
  if (loginType === 'admin') {
    return <AdminLogin onBackToUserLogin={() => setLoginType(null)} />;
  }

  // Show User Login (Clerk)
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/images/shipping-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-blue-900/30"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setLoginType(null)}
          className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <span>← Back to login options</span>
        </button>
        
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white p-2.5 rounded-full shadow-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            Shipment Tracker
          </h1>
          <p className="text-blue-100 text-sm drop-shadow">
            Manage your exports with confidence
          </p>
        </div>

        {/* SINGLE UNIFIED AUTH CONTAINER */}
        <div className="bg-white rounded-xl shadow-2xl border-2 border-white/20 overflow-hidden">
          
          {/* Toggle Buttons */}
          <div className="flex bg-gray-50 border-b">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                !isSignUp
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                isSignUp
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {isSignUp ? (
              <SignUp 
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                    card: 'shadow-none bg-transparent border-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'border-gray-300 text-gray-700 hover:bg-gray-50',
                    footer: 'hidden',
                  }
                }}
              />
            ) : (
              <SignIn 
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                    card: 'shadow-none bg-transparent border-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'border-gray-300 text-gray-700 hover:bg-gray-50',
                    footer: 'hidden',
                  }
                }}
              />
            )}
          </div>

          {/* Clerk branding */}
          <div className="px-6 pb-4 text-center">
            <p className="text-xs text-gray-500">
              Secured by <span className="font-semibold">Clerk</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { isAdmin } = useAuth();

  return (
    <>
      {/* Admin is logged in */}
      {isAdmin && <AdminDashboard />}
      
      {/* User is logged in with Clerk */}
      {!isAdmin && (
        <>
          <SignedIn>
            <Dashboard />
          </SignedIn>
          <SignedOut>
            <AuthPages />
          </SignedOut>
        </>
      )}
    </>
  );
};

export default App;