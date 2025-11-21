import React, { useState } from 'react';
import { Package, Search, Filter, ArrowUpDown } from 'lucide-react';
import ShipmentRow from './ShipmentRow';

const ShipmentTable = ({ shipments, onUpdateStatus }) => {
  // Table state management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('shipmentDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter shipments based on search term and status
  const filteredShipments = shipments.filter(shipment => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchLower) ||
      shipment.customerName.toLowerCase().includes(searchLower) ||
      shipment.productName.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort filtered shipments
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle date sorting
    if (sortField === 'shipmentDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortField('shipmentDate');
    setSortDirection('desc');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Shipment Tracking ({filteredShipments.length} of {shipments.length})
          </h2>
          
          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tracking number, customer, or product..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-32 transition duration-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => handleSort('trackingNumber')}
              >
                <div className="flex items-center">
                  Tracking Number
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                  <span className="font-bold">{getSortIndicator('trackingNumber')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center">
                  Customer
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                  <span className="font-bold">{getSortIndicator('customerName')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => handleSort('productName')}
              >
                <div className="flex items-center">
                  Product
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                  <span className="font-bold">{getSortIndicator('productName')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => handleSort('shipmentDate')}
              >
                <div className="flex items-center">
                  Ship Date
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                  <span className="font-bold">{getSortIndicator('shipmentDate')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedShipments.length > 0 ? (
              sortedShipments.map((shipment) => (
                <ShipmentRow
                  key={shipment.id}
                  shipment={shipment}
                  onUpdateStatus={onUpdateStatus}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Package className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm || statusFilter !== 'All' 
                        ? 'No matching shipments found' 
                        : 'No shipments yet'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'All'
                        ? 'Try adjusting your search or filters'
                        : 'Add your first shipment using the form above!'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentTable;