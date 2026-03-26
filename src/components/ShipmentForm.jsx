import React, { useState } from 'react';
import { Plus, Package, ChevronDown, Ruler, Users, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ShipmentForm = ({ onAddShipment }) => {
  const { isDark } = useTheme();
  // Form state management
 const [formData, setFormData] = useState({
    brand: '',
    category: '',
    clothingType: '',
    size: '',
    age: '',
    quantity: '',
    shipmentDate: '',
    phoneNumber: '',
    status: 'Pending Approval'
  });

  // Brand options
  const brands = [
    'Zara',
    'H&M',
    'Mango',
    'Next',
    'Uniqlo',
    'Gap',
    'Forever 21',
    'Massimo Dutti',
    'Pull & Bear',
    'Bershka'
  ];

  // Category options
  const categories = ['Men', 'Women', 'Children', 'GenZ'];

  // Clothing types by category
  const clothingTypes = {
    Men: ['T-Shirt', 'Shirt', 'Jeans', 'Trousers', 'Jacket', 'Blazer'],
    Women: ['Dress', 'Top', 'Skirt', 'Jeans', 'Blouse', 'Cardigan'],
    Children: ['T-Shirt', 'Shorts', 'Dress', 'Hoodie', 'Pants', 'Jacket'],
    GenZ: ['Hoodie', 'Joggers', 'Crop Top', 'Oversized Tee', 'Cargo Pants', 'Bomber Jacket']
  };

  // Size options by category
  const sizeOptions = {
    Men: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    Women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    Children: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
    GenZ: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  };

  // Age group options
  const ageGroups = ['0-5', '6-12', '13-17', '18-25', '26-35', '36-45', '46-55', '56+'];

  // Generate random tracking number
  const generateTrackingNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${randomNum}`;
  };

  // Phone number regex for Indian numbers (+91 optional, 10 digits starting with 6-9)
  const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
     if(formData.brand && formData.category && formData.clothingType && formData.size && formData.age && formData.quantity && formData.shipmentDate && formData.phoneNumber) {

      // Validate phone number format
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid Indian phone number (10 digits starting with 6-9, +91 optional)');
        return;
      }
      const trackingNumber = generateTrackingNumber();
      
    const newShipment = {
        trackingNumber: trackingNumber,
        brand: formData.brand,
        category: formData.category,
        clothingType: formData.clothingType,
        size: formData.size,
        age: formData.age,
        quantity: parseInt(formData.quantity),
        shipmentDate: formData.shipmentDate,
        phoneNumber: formData.phoneNumber,
        status: formData.status
      };
      
      // Send new shipment to parent component
      onAddShipment(newShipment);
      
      // Reset form
   setFormData({
        brand: '',
        category: '',
        clothingType: '',
        size: '',
        age: '',
        quantity: '',
        shipmentDate: '',
        phoneNumber: '',
        status: 'Pending Approval'
      });
    } else {
      alert('Please fill in all required fields!');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If category changes, reset clothing type and size
    if (name === 'category') {
      setFormData({
        ...formData,
        [name]: value,
        clothingType: '',
        size: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Custom Select Component
  const CustomSelect = ({ label, name, value, options, placeholder, icon, disabled = false }) => (
    <div className="group">
      <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {icon}
        {label} *
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full p-4 pr-12 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 hover:border-slate-400'}`}
          required
        >
          <option value="" className={isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className={isDark ? 'bg-slate-900 text-white py-2' : 'bg-white text-slate-800 py-2'}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-emerald-400 transition-colors duration-200" />
      </div>
    </div>
  );

  return (
    <div className={`backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-2xl animate-fade-in-up transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50' : 'bg-white/80 border border-slate-200'}`} style={{animationDelay: '0.5s'}}>
      {/* Form Header */}
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mr-3">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Book a Shipment</h2>
          <p className={`text-sm font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Create a new logistics booking</p>
        </div>
      </div>
      
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Brand Dropdown */}
        <CustomSelect
          label="Brand"
          name="brand"
          value={formData.brand}
          options={brands}
          placeholder="Select a brand"
          icon={<Package className="w-4 h-4 text-emerald-400" />}
        />
        
        {/* Category Dropdown */}
        <CustomSelect
          label="Category"
          name="category"
          value={formData.category}
          options={categories}
          placeholder="Select category"
        />
        
        {/* Clothing Type Dropdown - Dynamic based on category */}
        <CustomSelect
          label="Clothing Type"
          name="clothingType"
          value={formData.clothingType}
          options={formData.category ? clothingTypes[formData.category] : []}
          placeholder={formData.category ? 'Select clothing type' : 'Select category first'}
          disabled={!formData.category}
        />
        
        {/* Size Dropdown - Dynamic based on category */}
        <CustomSelect
          label="Size"
          name="size"
          value={formData.size}
          options={formData.category ? sizeOptions[formData.category] : []}
          placeholder={formData.category ? 'Select size' : 'Select category first'}
          icon={<Ruler className="w-4 h-4 text-emerald-400" />}
          disabled={!formData.category}
        />
        
        {/* Age Group Dropdown */}
        <CustomSelect
          label="Age Group"
          name="age"
          value={formData.age}
          options={ageGroups}
          placeholder="Select age group"
          icon={<Users className="w-4 h-4 text-emerald-400" />}
        />
        
       {/* Quantity Input */}
        <div className="group">
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            min="1"
            className={`w-full p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 ${isDark ? 'bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 hover:border-slate-400'}`}
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Phone Number Input */}
        <div className="group">
          <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Phone className="w-4 h-4 text-emerald-400" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={`w-full p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 ${isDark ? 'bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 hover:border-slate-400'}`}
            placeholder="+91 9876543210"
            required
          />
        </div>
        
        {/* Shipment Date */}
        <div className="group lg:col-span-3">
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Shipment Date *
          </label>
          <input
            type="date"
            name="shipmentDate"
            value={formData.shipmentDate}
            onChange={handleChange}
            className={`w-full p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 ${isDark ? 'bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 hover:border-slate-400'}`}
            required
          />
        </div>
        
        {/* Submit Button */}
        <div className="lg:col-span-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl transition duration-300 flex items-center justify-center shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Book Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentForm;