import React from 'react';
import { Truck, CheckCircle, Clock, Trash2, ArrowRight, Package, Ruler, Users, ShieldCheck, XCircle, ClipboardCheck } from 'lucide-react';

const ShipmentRow = ({ shipment, onUpdateStatus, onDeleteShipment, isDark = true, readOnly = false }) => {
  // Get status icon based on current status
 const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending Approval':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Approved':
        return <ClipboardCheck className="w-4 h-4 text-blue-400" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'In Transit':
        return <Truck className="w-4 h-4 text-cyan-400" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  // Get status badge styling
   const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-amber-500/20';
      case 'Approved':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-blue-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-300 border-red-500/30 shadow-red-500/20';
      case 'In Transit':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-cyan-500/20';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  // Determine next status in workflow
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending Approval':
        return 'Approved';
      case 'Approved':
        return 'In Transit';
      case 'In Transit':
        return 'Delivered';
      default:
        return currentStatus;
    }
  };

  // Check if status can be advanced
  const canAdvanceStatus = shipment.status !== 'Delivered' && shipment.status !== 'Rejected';

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete shipment ${shipment.trackingNumber}?`)) {
      onDeleteShipment(shipment.id);
    }
  };

  // Handle old vs new data format
  const displayBrand = shipment.brand || 'N/A';
  const displayCategory = shipment.category || (shipment.customerName ? `Customer: ${shipment.customerName}` : 'N/A');
  const displayProduct = shipment.clothingType || shipment.productName || 'N/A';
  const displaySize = shipment.size || '-';
  const displayAge = shipment.age || '-';
  const displayQuantity = shipment.quantity || '-';

  return (
    <tr className={`group transition duration-200 ${isDark ? 'hover:bg-slate-800/40 border-b border-slate-700/30' : 'hover:bg-slate-50 border-b border-slate-100'}`}>
      {/* Tracking Number */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <span className={`font-mono text-sm px-3 py-1.5 rounded-lg border group-hover:border-emerald-500/50 transition-colors duration-200 ${isDark ? 'bg-slate-700/50 text-slate-300 border-slate-600/50' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {shipment.trackingNumber}
          </span>
        </div>
      </td>
      
      {/* Brand */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-500" />
          <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{displayBrand}</span>
        </div>
      </td>
      
      {/* Category */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{displayCategory}</span>
      </td>
      
      {/* Product/Clothing Type */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{displayProduct}</span>
      </td>
      
      {/* Size */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Ruler className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-sm font-medium text-cyan-500">{displaySize}</span>
        </div>
      </td>
      
      {/* Age */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-sm font-medium text-purple-500">{displayAge}</span>
        </div>
      </td>
      
      {/* Quantity */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className="text-sm font-semibold text-emerald-500">{displayQuantity}</span>
      </td>
      
      {/* Shipment Date */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatDate(shipment.shipmentDate)}</span>
      </td>
      
      {/* Status */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getStatusIcon(shipment.status)}
          <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-lg border shadow-lg ${getStatusColor(shipment.status)}`}>
            {shipment.status}
          </span>
        </div>
      </td>
      
      {/* Actions */}
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Status Update Buttons - Only shown when NOT readOnly (admin only) */}
          {!readOnly && (
            <>
              {/* Special buttons for Pending Approval status */}
              {shipment.status === 'Pending Approval' ? (
                <>
                  {/* Approve Button */}
                  <button
                    onClick={() => onUpdateStatus(shipment.id, 'Approved')}
                    className="text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition duration-200 text-xs font-semibold border border-emerald-500/30 hover:border-emerald-500/50 flex items-center gap-2 group/btn"
                  >
                    <CheckCircle className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform duration-200" />
                    Approve
                  </button>
                  {/* Reject Button */}
                  <button
                    onClick={() => onUpdateStatus(shipment.id, 'Rejected')}
                    className="text-orange-500 hover:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 px-4 py-2 rounded-lg transition duration-200 text-xs font-semibold border border-orange-500/30 hover:border-orange-500/50 flex items-center gap-2 group/btn"
                  >
                    <XCircle className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform duration-200" />
                    Reject
                  </button>
                </>
              ) : canAdvanceStatus ? (
                <button
                  onClick={() => onUpdateStatus(shipment.id, getNextStatus(shipment.status))}
                  className="text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition duration-200 text-xs font-semibold border border-emerald-500/30 hover:border-emerald-500/50 flex items-center gap-2 group/btn"
                >
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  {getNextStatus(shipment.status)}
                </button>
              ) : (
                <span className="text-emerald-500 text-xs font-semibold px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Complete
                </span>
              )}
            </>
          )}
          
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg transition duration-200 text-xs font-semibold border border-red-500/30 hover:border-red-500/50 flex items-center gap-1.5 group/del"
            title="Delete shipment"
          >
            <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform duration-200" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ShipmentRow;