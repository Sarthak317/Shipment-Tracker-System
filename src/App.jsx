import React, { useState } from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignIn, 
  SignUp, 
  useUser 
} from '@clerk/clerk-react';
import { ShipmentForm, ShipmentTable } from './components';
import { Package, Clock, Truck, CheckCircle, TrendingUp } from 'lucide-react';
import Header from './components/layout/Header';

// Main Dashboard Component (your existing shipment tracker)
const Dashboard = () => {
  const { user } = useUser();
  
  // Your existing shipment state and logic
  const [shipments, setShipments] = useState([
    {
      id: '1',
      trackingNumber: 'TRK001234567',
      customerName: 'ABC Electronics Ltd.',
      productName: 'Laptop Computers (5 units)',
      shipmentDate: '2024-09-15',
      status: 'In Transit',
      createdAt: '2024-09-15T10:00:00Z'
    },
    {
      id: '2',
      trackingNumber: 'TRK001234568',
      customerName: 'Global Tech Solutions',
      productName: 'Mobile Phones (20 units)',
      shipmentDate: '2024-09-16',
      status: 'Pending',
      createdAt: '2024-09-16T14:30:00Z'
    },
    {
      id: '3',
      trackingNumber: 'TRK001234569',
      customerName: 'Smart Home Co.',
      productName: 'Smart Speakers (10 units)',
      shipmentDate: '2024-09-10',
      status: 'Delivered',
      createdAt: '2024-09-10T09:15:00Z'
    }
  ]);

  const handleAddShipment = (newShipment) => {
    setShipments(prevShipments => [newShipment, ...prevShipments]);
  };

  const handleUpdateStatus = (shipmentId, newStatus) => {
    setShipments(prevShipments =>
      prevShipments.map(shipment =>
        shipment.id === shipmentId
          ? { ...shipment, status: newStatus, updatedAt: new Date().toISOString() }
          : shipment
      )
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="mt-2 text-gray-600 text-lg">
                Manage your shipments efficiently
              </p>
            </div>
            
            <div className="hidden md:block bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition duration-200">
            <div className="flex items-center">
              <Package className="w-10 h-10 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Shipments</p>
                <p className="text-3xl font-bold text-gray-900">{counts.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition duration-200">
            <div className="flex items-center">
              <Clock className="w-10 h-10 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{counts.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition duration-200">
            <div className="flex items-center">
              <Truck className="w-10 h-10 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-3xl font-bold text-gray-900">{counts.inTransit}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition duration-200">
            <div className="flex items-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-3xl font-bold text-gray-900">{counts.delivered}</p>
              </div>
            </div>
          </div>
        </div>

        <ShipmentForm onAddShipment={handleAddShipment} />
        <ShipmentTable 
          shipments={shipments} 
          onUpdateStatus={handleUpdateStatus} 
        />
      </div>
    </div>
  );
};

const AuthPages = () => {
  const [isSignUp, setIsSignUp] = useState(false);

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
      
      {/* SINGLE CLEAN CONTAINER */}
      <div className="relative z-10 w-full max-w-md">
        
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
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <AuthPages />
      </SignedOut>
    </>
  );
};

export default App;