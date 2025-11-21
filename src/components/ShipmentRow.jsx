import React from 'react';
import { Truck, CheckCircle, Clock } from 'lucide-react';

const ShipmentRow = ({ shipment, onUpdateStatus }) => {
  // Get status icon based on current status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'In Transit':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Determine next status in workflow
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'In Transit';
      case 'In Transit':
        return 'Delivered';
      default:
        return currentStatus;
    }
  };

  // Check if status can be advanced
  const canAdvanceStatus = shipment.status !== 'Delivered';

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

  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      {/* Tracking Number */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
            {shipment.trackingNumber}
          </span>
        </div>
      </td>
      
      {/* Customer Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {shipment.customerName}
      </td>
      
      {/* Product Name */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {shipment.productName}
      </td>
      
      {/* Shipment Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(shipment.shipmentDate)}
      </td>
      
      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(shipment.status)}
          <span className={`ml-2 px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusColor(shipment.status)}`}>
            {shipment.status}
          </span>
        </div>
      </td>
      
      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {canAdvanceStatus ? (
          <button
            onClick={() => onUpdateStatus(shipment.id, getNextStatus(shipment.status))}
            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition duration-200 text-xs font-medium border border-blue-200 hover:border-blue-300"
          >
            Advance to {getNextStatus(shipment.status)}
          </button>
        ) : (
          <span className="text-green-600 text-xs font-medium px-3 py-2 bg-green-50 rounded-md border border-green-200">
            Complete
          </span>
        )}
      </td>
    </tr>
  );
};

export default ShipmentRow;