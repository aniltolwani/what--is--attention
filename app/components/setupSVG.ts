'use client';

import * as d3 from 'd3';

export const setupSVG = (svgRef: React.RefObject<SVGSVGElement>, dimensions: { width: number, height: number }) => {
  if (!svgRef.current) {
    console.warn('SVG element not found. setupSVG aborted.');
    return;
  }

  const svg = d3.select(svgRef.current)
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('class', 'main-group')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Set up scales
  const xScale = d3.scaleLinear()
    .domain([-2, 2])  // Adjust this based on your data range
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([-2, 2])  // Adjust this based on your data range
    .range([height, 0]);

  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  // Add grid lines
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis
      .tickSize(-height)
      .tickFormat(() => '')
    )
    .style('stroke', '#e0e0e0')
    .style('stroke-opacity', '0.3');

  g.append('g')
    .attr('class', 'grid')
    .call(yAxis
      .tickSize(-width)
      .tickFormat(() => '')
    )
    .style('stroke', '#e0e0e0')
    .style('stroke-opacity', '0.3');

  // Add arrowhead definition
  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#4D5663")
    .style("stroke", "none");

  return { xScale, yScale, g };
};