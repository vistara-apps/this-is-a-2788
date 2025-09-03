import React, { useState } from 'react';
import { Heart, Download, Eye } from 'lucide-react';

function PhotoCard({ photo, theme }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden shadow-card hover:shadow-modal transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
          showOverlay ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-4">
            <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
              <Eye className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
            >
              <Heart 
                className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
              />
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200">
              <Download className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="p-4">
        <p className="text-text-primary font-medium">{photo.caption}</p>
        <p className="text-text-secondary text-sm mt-1 capitalize">{photo.gallery}</p>
      </div>
    </div>
  );
}

export default PhotoCard;