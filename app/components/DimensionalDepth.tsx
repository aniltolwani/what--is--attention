import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DimensionalDepth: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Define the drop shadow filter
        const defs = svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");
        
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
        
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)
            .attr("dy", 5)
            .attr("result", "offsetBlur");
        
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "offsetBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // Add circles with and without shadows
        svg.append("circle")
            .attr("cx", 100)
            .attr("cy", 100)
            .attr("r", 40)
            .attr("fill", "blue")
            .style("filter", "url(#drop-shadow)");

        svg.append("circle")
            .attr("cx", 250)
            .attr("cy", 100)
            .attr("r", 40)
            .attr("fill", "green");
    }, []);

    return <svg ref={svgRef} width={400} height={200}></svg>;
};

export default DimensionalDepth;