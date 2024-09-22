'use client'
// src/app/page.tsx
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useSpring, animated } from 'react-spring';
import './app.css';
import Tooltip from './components/tooltip'; // Ensure the path is correct

// Define the structure of your data
interface TokenData {
  token: string;
  embeddings: number[][]; // [layer][x, y]
  attention: number[][];  // [layer][toTokenIndex]
  previousPositions: [number, number][]; // For trails
}

// AnimatedArrow Component with Curved Paths and Pulsing
const AnimatedArrow: React.FC<{
  start: [number, number];
  end: [number, number];
  color: string;
  onClick: () => void;
  className?: string;
}> = ({ start, end, color, onClick, className }) => {
  const ref = useRef<SVGPathElement>(null);
  
  const controlPoint: [number, number] = [
    (start[0] + end[0]) / 2,
    Math.min(start[1], end[1]) - 50, // Adjust for curvature
  ];

  const path = `M${start[0]},${start[1]} Q${controlPoint[0]},${controlPoint[1]} ${end[0]},${end[1]}`;

  const spring = useSpring({
    strokeDasharray: 1000,
    strokeDashoffset: 0,
    from: { strokeDasharray: 0, strokeDashoffset: 1000 },
    to: { strokeDasharray: 1000, strokeDashoffset: 0 },
    config: { duration: 1000 },
    loop: { reverse: false },
  });

  return (
    <animated.path
      ref={ref}
      d={path}
      stroke={color}
      strokeWidth={2}
      fill="none"
      markerEnd="url(#arrowhead)"
      onClick={onClick}
      className={className}
      style={{ cursor: 'pointer', ...spring }}
    >
      <animate
        attributeName="stroke"
        values={`${color};${d3.interpolateRgb("#ff6328", "#4682b4")(0.5)};${color}`}
        dur="2s"
        repeatCount="indefinite"
      />
    </animated.path>
  );
};

// EmbeddingPoint Component with Trails and Tooltip Handlers
const EmbeddingPoint: React.FC<{
  position: [number, number];
  color: string;
  token: string;
  isSelected: boolean;
  onSelect: () => void;
  previousPositions: [number, number][];
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}> = ({ position, color, token, isSelected, onSelect, previousPositions, onMouseEnter, onMouseLeave }) => {
  const props = useSpring({
    transform: `translate(${position[0]}px, ${position[1]}px) scale(${isSelected ? 1.5 : 1})`,
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.g style={props} onClick={onSelect} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Trail Paths */}
      {previousPositions.map((pos, idx) => (
        <circle
          key={idx}
          cx={pos[0]}
          cy={pos[1]}
          r={5}
          fill={color}
          opacity={(idx + 1) / previousPositions.length * 0.3}
        />
      ))}
      <circle r={10} fill={color} />
      {isSelected && (
        <text x={15} y={-15} fontSize="12px" fill="#000">
          {token}
        </text>
      )}
    </animated.g>
  );
};

const App: React.FC = () => {
  // Initial tokensData with empty previousPositions
  const initialTokensData: TokenData[] = [
    {
      token: 'golden',
      embeddings: [
        [100, 200],
        [150, 220],
        [200, 250],
        [250, 300],
      ],
      attention: [
        [0.1, 0.3, 0.6],
        [0.2, 0.2, 0.6],
        [0.25, 0.25, 0.5],
        [0.3, 0.2, 0.5],
      ],
      previousPositions: [],
    },
    {
      token: 'gate',
      embeddings: [
        [300, 100],
        [310, 150],
        [330, 200],
        [360, 250],
      ],
      attention: [
        [0.2, 0.2, 0.6],
        [0.25, 0.25, 0.5],
        [0.3, 0.2, 0.5],
        [0.35, 0.15, 0.5],
      ],
      previousPositions: [],
    },
    {
      token: 'bridge',
      embeddings: [
        [400, 400],
        [420, 410],
        [440, 430],
        [460, 450],
      ],
      attention: [
        [0.3, 0.3, 0.2],
        [0.35, 0.15, 0.35],
        [0.4, 0.1, 0.4],
        [0.45, 0.05, 0.45],
      ],
      previousPositions: [],
    },
  ];

  const [tokensData, setTokensData] = useState<TokenData[]>(initialTokensData);
  const layersCount = tokensData[0].embeddings.length;

  const [currentLayer, setCurrentLayer] = useState<number>(0);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playRef = useRef<NodeJS.Timeout | null>(null);

  // Tooltip state
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  // Handle play/pause functionality
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setCurrentLayer((prevLayer) =>
          prevLayer < layersCount - 1 ? prevLayer + 1 : 0
        );
      }, 2000);
    } else if (playRef.current) {
      clearInterval(playRef.current);
      playRef.current = null;
    }
    return () => {
      if (playRef.current) {
        clearInterval(playRef.current);
      }
    };
  }, [isPlaying, layersCount]);

  // Update previousPositions when currentLayer changes
  useEffect(() => {
    setTokensData((prevData) =>
      prevData.map((token) => ({
        ...token,
        previousPositions: [
          ...token.previousPositions.slice(-10),
          token.embeddings[currentLayer],
        ],
      }))
    );
  }, [currentLayer]);

  // Determine SVG dimensions
  const width = 800;
  const height = 600;

  // Create scales
  const xScale = d3.scaleLinear().domain([0, d3.max(tokensData.flatMap(d => d.embeddings.map(e => e[0])))!]).range([50, width - 50]);
  const yScale = d3.scaleLinear().domain([0, d3.max(tokensData.flatMap(d => d.embeddings.map(e => e[1])))!]).range([height - 50, 50]);

  // Define color scale for attention
  const colorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(["#4682b4", "#ff6328"]); // Blue to Orange

  // Zoom and Pan setup
  useEffect(() => {
    const svg = d3.select(`#embedding-svg`);
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        svg.select("g").attr("transform", event.transform);
      });

    svg.call(zoomBehavior);
  }, []);

  return (
    <div className="container">
      <h1>Word Embedding Visualizer</h1>

      {/* Sentence Display with Highlighted Token */}
      <div className="sentence">
        {tokensData.map((tokenData, idx) => (
          <span
            key={idx}
            className={`token ${idx === selectedTokenIndex ? 'highlight' : ''}`}
            onClick={() => setSelectedTokenIndex(idx)}
          >
            {tokenData.token}
            {idx < tokensData.length - 1 && ' '}
          </span>
        ))}
      </div>

      {/* 2D Embedding Visualization */}
      <div className="visualization-container" style={{ position: 'relative' }}>
        <svg id="embedding-svg" width={width} height={height}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
            </marker>
          </defs>

          <g>
            {/* Axes */}
            <line x1={50} y1={height - 50} x2={width - 50} y2={height - 50} stroke="#000" />
            <line x1={50} y1={height - 50} x2={50} y2={50} stroke="#000" />

            {/* Grid */}
            {xScale.ticks(10).map((tick, idx) => (
              <line
                key={`x-tick-${idx}`}
                x1={xScale(tick)}
                y1={50}
                x2={xScale(tick)}
                y2={height - 50}
                stroke="#e0e0e0"
              />
            ))}
            {yScale.ticks(10).map((tick, idx) => (
              <line
                key={`y-tick-${idx}`}
                x1={50}
                y1={yScale(tick)}
                x2={width - 50}
                y2={yScale(tick)}
                stroke="#e0e0e0"
              />
            ))}

            {/* Embeddings */}
            {tokensData.map((token, idx) => {
              const [x, y] = token.embeddings[currentLayer];
              const scaledPosition: [number, number] = [xScale(x), yScale(y)];
              const attentionWeights = token.attention[currentLayer];
              return (
                <EmbeddingPoint
                  key={idx}
                  position={scaledPosition}
                  color={idx === selectedTokenIndex ? '#FFD700' : '#1f77b4'}
                  token={token.token}
                  isSelected={idx === selectedTokenIndex}
                  onSelect={() => setSelectedTokenIndex(idx)}
                  previousPositions={token.previousPositions}
                  onMouseEnter={(e) => {
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      content: `Token: ${token.token}\nLayer: ${currentLayer + 1}`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}

            {/* Attention Arrows */}
            {tokensData.map((token, idx) => {
              const [x, y] = token.embeddings[currentLayer];
              const currentPosition: [number, number] = [xScale(x), yScale(y)];
              return token.attention[currentLayer].map((weight, tgtIdx) => {
                if (weight < 0.1) return null;
                const target = tokensData[tgtIdx];
                const [tx, ty] = target.embeddings[currentLayer];
                const targetPosition: [number, number] = [xScale(tx), yScale(ty)];
                const color = colorScale(weight);
                return (
                  <AnimatedArrow
                    key={`${idx}-${tgtIdx}`}
                    start={currentPosition}
                    end={targetPosition}
                    color={color}
                    onClick={() => setSelectedTokenIndex(idx)}
                    className="attention-pulse"
                  />
                );
              });
            })}
          </g>
        </svg>
        {tooltip && <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} />}
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${((currentLayer + 1) / layersCount) * 100}%` }}
          ></div>
        </div>
        <span>
          Layer {currentLayer + 1} / {layersCount}
        </span>
      </div>

      {/* Detail Panel */}
      <div className="detail-panel">
        <h2>Token Details</h2>
        <p>
          <strong>Token:</strong> {tokensData[selectedTokenIndex].token}
        </p>
        <p>
          <strong>Embedding Vector:</strong>{' '}
          [{tokensData[selectedTokenIndex].embeddings[currentLayer][0].toFixed(2)},{' '}
          {tokensData[selectedTokenIndex].embeddings[currentLayer][1].toFixed(2)}]
        </p>
        <p>
          <strong>Attention Weights:</strong>
        </p>
        <ul>
          {tokensData[selectedTokenIndex].attention[currentLayer].map((weight, idx) => (
            <li key={idx}>
              {tokensData[idx].token}: {(weight * 100).toFixed(1)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

