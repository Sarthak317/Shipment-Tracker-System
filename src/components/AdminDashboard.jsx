import React, { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, TrendingUp, Shield, Users as UsersIcon } from 'lucide-react';
import Header from './layout/Header';
import ShipmentTable from './ShipmentTable';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const AdminDashboard = () => {
  const { isDark } = useTheme();
  const { adminEmail } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for ALL shipments (admin view)
  useEffect(() => {
    // Query ALL shipments without user filter
    const q = query(
      collection(db, 'shipments'),
      orderBy('createdAt', 'desc')
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
      
      console.log('🔐 Admin loaded all shipments:', shipmentsData.length);
      
      setShipments(shipmentsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching shipments:", error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Admin can update shipment status
  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      const shipmentRef = doc(db, 'shipments', shipmentId);
      await updateDoc(shipmentRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Admin updated shipment ${shipmentId} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Admin can delete any shipment
  const handleDeleteShipment = async (shipmentId) => {
    try {
      const shipmentRef = doc(db, 'shipments', shipmentId);
      await deleteDoc(shipmentRef);
      console.log(`🗑️ Admin deleted shipment ${shipmentId}`);
    } catch (error) {
      console.error('Error deleting shipment:', error);
      alert('Failed to delete shipment. Please try again.');
    }
  };

 const getStatusCounts = () => {
    return {
      total: shipments.length,
      pendingApproval: shipments.filter(s => s.status === 'Pending Approval').length,
      approved: shipments.filter(s => s.status === 'Approved').length,
      rejected: shipments.filter(s => s.status === 'Rejected').length,
      inTransit: shipments.filter(s => s.status === 'In Transit').length,
      delivered: shipments.filter(s => s.status === 'Delivered').length
    };
  };

  const getUniqueUsers = () => {
    const uniqueEmails = new Set(shipments.map(s => s.userEmail).filter(Boolean));
    return uniqueEmails.size;
  };

  const getCompletionRate = () => {
    if (shipments.length === 0) return 0;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    return Math.round((delivered / shipments.length) * 100);
  };

  const counts = getStatusCounts();
  const completionRate = getCompletionRate();
  const totalUsers = getUniqueUsers();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        <div className="text-center">
          <div className="relative">
            <Shield className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 bg-red-500/20 blur-3xl animate-pulse"></div>
          </div>
          <p className={`text-xl font-light tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <Header isAdmin={true} />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${isDark ? 'bg-red-500/5' : 'bg-red-500/10'}`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed ${isDark ? 'bg-orange-500/5' : 'bg-orange-500/10'}`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Admin Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Admin Portal
                </h1>
              </div>
              <p className={`text-lg font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Logged in as: <span className="font-semibold text-red-500">{adminEmail}</span>
              </p>
            </div>
            
            <div className={`backdrop-blur-sm rounded-2xl border shadow-2xl p-6 min-w-[200px] animate-slide-in-right ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Success Rate</p>
                  <p className="text-3xl font-bold text-red-500">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          {/* Total Users */}
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-red-500/50 hover:shadow-red-500/10' : 'bg-white/80 border-slate-200 hover:border-red-500/50 hover:shadow-red-500/20'}`} style={{animationDelay: '0.05s'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-500">{totalUsers}</span>
              </div>
            </div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Users</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{totalUsers}</p>
          </div>

          {/* Total Shipments */}
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
          
          {/* Pending */}
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-amber-500/50 hover:shadow-amber-500/10' : 'bg-white/80 border-slate-200 hover:border-amber-500/50 hover:shadow-amber-500/20'}`} style={{animationDelay: '0.15s'}}>
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
          
          {/* In Transit */}
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-cyan-500/50 hover:shadow-cyan-500/10' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 hover:shadow-cyan-500/20'}`} style={{animationDelay: '0.2s'}}>
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
          
          {/* Delivered */}
          <div className={`group backdrop-blur-sm rounded-2xl border p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-emerald-500/10' : 'bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:shadow-emerald-500/20'}`} style={{animationDelay: '0.25s'}}>
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

        {/* All Shipments Table - Admin can update status */}
        <ShipmentTable 
          shipments={shipments} 
          onUpdateStatus={handleUpdateStatus}
          onDeleteShipment={handleDeleteShipment}
          readOnly={false}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
