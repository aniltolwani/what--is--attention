'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import VectorOperation from '../types/vectorInterfaces';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { setupSVG } from './setupSVG';
import { renderMainVectors } from './renderMainVectors';
import { animateOperation } from './animateOperation';
import { fetchAndDisplayNearestWords } from './fetchandDisplayNearestWords';
import { useTooltips } from './useTooltips';
import { NearestWord } from '../types/vectorInterfaces';
import NeighborsTooltip from './NeighborsTooltip';

interface VectorVisualizationProps {
  operation: VectorOperation | null;
}

const VectorVisualization: React.FC<VectorVisualizationProps> = ({ operation }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useMemo(() => ({ width: 800, height: 600 }), []);

  const [nearestWords, setNearestWords] = useState<NearestWord[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { xScale, yScale, colorScale } = useMemo(() => ({
    xScale: d3.scaleLinear().domain([-2, 2]).range([0, dimensions.width - 100]),
    yScale: d3.scaleLinear().domain([-2, 2]).range([dimensions.height - 100, 0]),
    colorScale: d3.scaleOrdinal<string>()
      .domain(['Vector 1', 'Vector 2', 'Base Vector', 'Result Vector', 'Nearest Words'])
      .range(['#FF5A5F', '#00A699', '#FC642D', '#4D5663', '#FFB400'])
  }), [dimensions]);

  useEffect(() => {
    if (!svgRef.current || !operation) return;
    setupSVG(svgRef, dimensions);
  }, [dimensions, operation]);

  useEffect(() => {
    if (!svgRef.current || !operation) return;
    const svg = d3.select(svgRef.current);
    svg.select("g").selectAll("*").remove();
    const g = svg.select("g");

    renderMainVectors(g, operation, xScale, yScale, colorScale);
    animateOperation(g, operation, xScale, yScale, colorScale, () => {
      fetchAndDisplayNearestWords(g, operation, xScale, yScale, colorScale, setNearestWords, setAnimationComplete);
    });
  }, [operation, dimensions, colorScale, xScale, yScale]);

  useEffect(() => {
    if (animationComplete && nearestWords.length > 0) {
      const svg = d3.select(svgRef.current);
      const resultPoint = svg.select("circle.main-point[data-category='Result Vector']");
      
      resultPoint
        .attr("data-tooltip-id", "neighbors-tooltip")
        .attr("data-tooltip-content", " ");
    }
  }, [animationComplete, nearestWords]);

  useTooltips(animationComplete, nearestWords);

  return (
    <div className="visualization-wrapper bg-white rounded-lg shadow-lg p-4">
      <svg 
        ref={svgRef} 
        className="vector-visualization w-full h-full"
        style={{ minHeight: '600px' }}
      />
      <Tooltip id="neighbors-tooltip" place="top" clickable>
        <NeighborsTooltip nearestWords={nearestWords} />
      </Tooltip>
    </div>
  );
};

export default VectorVisualization;
