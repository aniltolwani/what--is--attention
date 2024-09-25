import * as d3 from 'd3';
import VectorOperation from '../types/vectorInterfaces';

export const renderMainVectors = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  operation: VectorOperation,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  colorScale: d3.ScaleOrdinal<string, string>
) => {
  const data = [
    { word: operation.vector1Name, x: operation.vector1[0], y: operation.vector1[1], category: 'Vector 1' },
    { word: operation.vector2Name, x: operation.vector2[0], y: operation.vector2[1], category: 'Vector 2' },
    { word: operation.baseVectorName, x: operation.baseVector[0], y: operation.baseVector[1], category: 'Base Vector' },
    { word: 'Result', x: operation.resultVector[0], y: operation.resultVector[1], category: 'Result Vector' }
  ];
  console.log("data", data);
  console.log("renderMainVectors");

  // Add vector lines
  g.selectAll("line.vector-line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "vector-line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", d => xScale(d.x))
    .attr("y2", d => yScale(d.y))
    .attr("stroke", d => colorScale(d.category))
    .attr("stroke-width", 2)
    .attr("opacity", 0.7);

  // Add vector points
  const points = g.selectAll("circle.main-point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "main-point")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 0)
    .attr("fill", d => colorScale(d.category))
    .attr("opacity", 1)
    .attr("data-tooltip-id", "vector-tooltip")
    .attr("data-tooltip-content", d => `${d.word}: (${d.x.toFixed(2)}, ${d.y.toFixed(2)})`);

  points.transition()
    .duration(1000)
    .attr("r", 8)
    .ease(d3.easeElasticOut);

  // Add labels
  const labels = g.selectAll("text.main-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "main-label")
    .attr("x", d => xScale(d.x))
    .attr("y", d => yScale(d.y))
    .attr("dy", -15)
    .attr("text-anchor", "middle")
    .text(d => d.word)
    .attr("font-size", "14px")
    .attr("fill", "#333")
    .attr("opacity", 0);

  labels.transition()
    .duration(1000)
    .attr("opacity", 1)
    .ease(d3.easeQuadOut);
};