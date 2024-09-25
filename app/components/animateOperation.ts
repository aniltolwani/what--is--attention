import * as d3 from 'd3';
import VectorOperation from '../types/vectorInterfaces';

export const animateOperation = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  operation: VectorOperation,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  colorScale: d3.ScaleOrdinal<string, string>,
  onComplete: () => void
) => {
  const vec1to2Line = g.append("line")
    .attr("x1", xScale(operation.vector1[0]))
    .attr("y1", yScale(operation.vector1[1]))
    .attr("x2", xScale(operation.vector1[0]))
    .attr("y2", yScale(operation.vector1[1]))
    .attr("stroke", colorScale('Vector 1'))
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrowhead)");

  vec1to2Line.transition()
    .duration(1000)
    .attr("x2", xScale(operation.vector2[0]))
    .attr("y2", yScale(operation.vector2[1]))
    .on("end", () => {
      const intermediateX = operation.vector2[0] - operation.vector1[0];
      const intermediateY = operation.vector2[1] - operation.vector1[1];

      const intermediateLine = g.append("line")
        .attr("x1", xScale(operation.vector1[0]))
        .attr("y1", yScale(operation.vector1[1]))
        .attr("x2", xScale(operation.vector2[0]))
        .attr("y2", yScale(operation.vector2[1]))
        .attr("stroke", colorScale('Result Vector'))
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrowhead)");

      intermediateLine.transition()
        .duration(1000)
        .attr("x1", xScale(operation.baseVector[0]))
        .attr("y1", yScale(operation.baseVector[1]))
        .attr("x2", xScale(operation.baseVector[0] + intermediateX))
        .attr("y2", yScale(operation.baseVector[1] + intermediateY))
        .on("end", () => {
          onComplete();
          g.selectAll("line").remove();
        });
    });
};