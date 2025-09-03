import React from 'react';
import { X, Palette, Layout, Monitor } from 'lucide-react';

function CustomizationPanel({ show, theme, onThemeChange, onClose }) {
  const colorPresets = [
    { name: 'Purple Gradient', primary: '#667eea', accent: '#764ba2' },
    { name: 'Ocean Blue', primary: '#1e3a8a', accent: '#3b82f6' },
    { name: 'Sunset Orange', primary: '#ea580c', accent: '#f97316' },
    { name: 'Forest Green', primary: '#15803d', accent: '#22c55e' },
    { name: 'Rose Pink', primary: '#be185d', accent: '#ec4899' },
  ];

  const layoutOptions = [
    { id: '2col', name: '2 Columns', icon: '⚏' },
    { id: '3col', name: '3 Columns', icon: '⚏' },
    { id: 'masonry', name: 'Masonry', icon: '⚏' },
  ];

  if (!show) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-modal border-l border-gray-200 overflow-y-auto animate-slide-in z-40">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Customize</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Layout Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Layout className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-text-primary">Layout</h3>
          </div>
          <div className="space-y-2">
            {layoutOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onThemeChange({ ...theme, layout: option.id })}
                className={`w-full text-left p-3 rounded-md border transition-all duration-200 ${
                  theme.layout === option.id
                    ? 'border-primary bg-primary bg-opacity-10 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{option.icon}</span>
                  <span>{option.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Themes Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-text-primary">Color Themes</h3>
          </div>
          <div className="space-y-3">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => onThemeChange({
                  ...theme,
                  primaryColor: preset.primary,
                  accentColor: preset.accent
                })}
                className="w-full text-left p-3 rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{preset.name}</span>
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Monitor className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-text-primary">Preview</h3>
          </div>
          <div className="p-4 border border-gray-200 rounded-md">
            <div 
              className="h-20 rounded-md mb-3"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)` 
              }}
            />
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded" />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Subscription CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white">
          <h4 className="font-semibold mb-2">Upgrade to Premium</h4>
          <p className="text-sm opacity-90 mb-3">
            Unlock custom domains, advanced themes, and unlimited storage.
          </p>
          <button className="w-full bg-white text-purple-600 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
            Upgrade Now - $25/mo
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomizationPanel;