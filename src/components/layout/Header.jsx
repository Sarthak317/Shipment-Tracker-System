import React from 'react';
import { Package } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

const Header = () => {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Shipment Tracker
                </h1>
                <p className="text-xs text-gray-500">
                  Export Management System
                </p>
              </div>
            </div>
          </div>

          {/* User Menu with Clerk */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;