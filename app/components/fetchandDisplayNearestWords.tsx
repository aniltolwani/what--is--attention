import * as d3 from 'd3';
import VectorOperation from '../types/vectorInterfaces';
import { getNearestWords, euclideanDistance } from '../src/vectorUtils';
import { embeddings } from '../src/embeddings';
import { NearestWord } from '../types/vectorInterfaces';

export const fetchAndDisplayNearestWords = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  operation: VectorOperation,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  colorScale: d3.ScaleOrdinal<string, string>,
  setNearestWords: React.Dispatch<React.SetStateAction<NearestWord[]>>,
  setAnimationComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const nearest = getNearestWords(operation.resultVector, embeddings, 3);
  const nearestData: NearestWord[] = nearest.map((word, index) => {
    const distance = euclideanDistance(operation.resultVector, embeddings[word as keyof typeof embeddings]);
    const vector = embeddings[word as keyof typeof embeddings];
    return {
      word,
      distance,
      rank: index + 1,
      x: vector[0],
      y: vector[1]
    };
  });

  setNearestWords(nearestData);
  setAnimationComplete(true);

  // Add nearest words to the visualization
  const nwPoints = g.selectAll("circle.nearest-point")
    .data(nearestData)
    .enter()
    .append("circle")
    .attr("class", "nearest-point")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 0)
    .attr("fill", colorScale('Nearest Words'))
    .attr("opacity", 1)
    .attr("data-tooltip-id", d => `${d.word}-tooltip`)
    .attr("data-tooltip-content", d => `${d.rank}. ${d.word}: ${d.distance.toFixed(4)}`);

  // Animate nearest points appearing
  nwPoints.transition()
    .duration(1000)
    .attr("r", 5)
    .ease(d3.easeElasticOut);

  // Add labels for nearest words
  const nwLabels = g.selectAll("text.nearest-label")
    .data(nearestData)
    .enter()
    .append("text")
    .attr("class", "nearest-label")
    .attr("x", d => xScale(d.x))
    .attr("y", d => yScale(d.y))
    .attr("dy", -10)
    .attr("text-anchor", "middle")
    .text(d => d.word)
    .attr("font-size", "12px")
    .attr("fill", "#484848")
    .attr("opacity", 0);

  // Animate labels appearing
  nwLabels.transition()
    .duration(1000)
    .attr("opacity", 1)
    .ease(d3.easeQuadOut);

  // Add tooltip for the result vector
  g.append("circle")
    .attr("cx", xScale(operation.resultVector[0]))
    .attr("cy", yScale(operation.resultVector[1]))
    .attr("r", 8)
    .attr("fill", "transparent")
    .attr("stroke", colorScale('Result Vector'))
    .attr("stroke-width", 2)
    .attr("class", "result-vector-tooltip")
    .attr("data-tooltip-id", "result-vector-tooltip")
    .attr("data-tooltip-content", "Loading...");
};