import React from 'react';
import { Upload, Settings, Camera } from 'lucide-react';

function Navbar({ onUploadClick, onCustomizeClick }) {
  return (
    <nav className="gradient-bg text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8" />
            <span className="text-xl font-bold">Petfolio</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-gray-200 transition-colors duration-200">
              Gallery
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors duration-200">
              About
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-md hover:bg-opacity-30 transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button
              onClick={onCustomizeClick}
              className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-md hover:bg-opacity-30 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;