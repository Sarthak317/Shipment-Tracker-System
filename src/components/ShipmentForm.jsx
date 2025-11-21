import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ShipmentForm = ({ onAddShipment }) => {
  // Form state management
  const [formData, setFormData] = useState({
    trackingNumber: '',
    customerName: '',
    productName: '',
    shipmentDate: '',
    status: 'Pending'
  });

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (formData.trackingNumber && formData.customerName && formData.productName && formData.shipmentDate) {
      const newShipment = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Send new shipment to parent component
      onAddShipment(newShipment);
      
      // Reset form
      setFormData({
        trackingNumber: '',
        customerName: '',
        productName: '',
        shipmentDate: '',
        status: 'Pending'
      });
    } else {
      alert('Please fill in all required fields!');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Form Header */}
      <div className="flex items-center mb-4">
        <Plus className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Add New Shipment</h2>
      </div>
      
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tracking Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number *
          </label>
          <input
            type="text"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="TRK123456789"
            required
          />
        </div>
        
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="John Doe"
            required
          />
        </div>
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Electronics Package"
            required
          />
        </div>
        
        {/* Shipment Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipment Date *
          </label>
          <input
            type="date"
            name="shipmentDate"
            value={formData.shipmentDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        
        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentForm;