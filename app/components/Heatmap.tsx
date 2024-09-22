import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapProps {
    data: number[][];
    labels: string[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data, labels }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 500;
        const height = 500;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };

        const xScale = d3.scaleBand()
            .domain(labels)
            .range([margin.left, width - margin.right])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(labels)
            .range([margin.top, height - margin.bottom])
            .padding(0.05);

        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([0, d3.max(data, row => d3.max(row)) || 1]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "start");

        // Add Y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        // Add squares
        svg.append("g")
            .selectAll("rect")
            .data(data.flatMap((row, i) => row.map((value, j) => ({ x: labels[j], y: labels[i], value }))))
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.x)!)
            .attr("y", d => yScale(d.y)!)
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(d.value) as string)
            .on("mouseover", function(event, d) {
                // Tooltip implementation can be added here
                d3.select(this).attr("stroke", "black");
            })
            .on("mouseout", function() {
                d3.select(this).attr("stroke", null);
            });
    }, [data, labels]);

    return <svg ref={svgRef} width={600} height={600}></svg>;
};

export default Heatmap;