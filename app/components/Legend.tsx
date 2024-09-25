import React from 'react';

interface LegendProps {
  items: string[];
  colorScale: (item: string) => string;
}

const Legend: React.FC<LegendProps> = ({ items, colorScale }) => {
  return (
    <div className="legend">
      {items.map((item) => (
        <div key={item} className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: colorScale(item) }}
          ></span>
          <span className="legend-label">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;