import React from 'react';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, content }) => {
  return (
    <div
      className="tooltip"
      style={{
        position: 'absolute',
        left: x + 10,
        top: y + 10,
        padding: '5px 10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: '#fff',
        borderRadius: '4px',
        pointerEvents: 'none',
        fontSize: '12px',
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;