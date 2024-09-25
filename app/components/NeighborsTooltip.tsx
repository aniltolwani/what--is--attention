'use client';

import React from 'react';
import { NearestWord } from '../types/vectorInterfaces';

interface TooltipProps {
  nearestWords: NearestWord[];
}

const NeighborsTooltip: React.FC<TooltipProps> = ({ nearestWords }) => {
  const maxDistance = Math.max(...nearestWords.map(w => w.distance));

  return (
    <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Nearest Neighbors</h3>
      <div className="grid grid-cols-3 gap-2">
        {nearestWords.map((word, index) => {
          const intensity = 1 - (word.distance / maxDistance);
          const bgColor = `rgba(255, 99, 71, ${intensity})`;
          
          return (
            <div 
              key={index} 
              className="p-2 rounded" 
              style={{ backgroundColor: bgColor }}
            >
              <div className="font-medium">{word.word}</div>
              <div className="text-xs">Rank: {word.rank}</div>
              <div className="text-xs">Distance: {word.distance.toFixed(4)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NeighborsTooltip;