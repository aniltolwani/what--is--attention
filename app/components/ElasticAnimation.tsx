import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ElasticAnimationProps {
    tension: number;
    friction: number;
}

const ElasticAnimation: React.FC<ElasticAnimationProps> = ({ tension, friction }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const circle = svg.append("circle")
            .attr("cx", 50)
            .attr("cy", 150)
            .attr("r", 20)
            .attr("fill", "steelblue");

        circle.transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .attr("cx", 300)
            .transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .attr("cx", 50);
    }, [tension, friction]);

    return <svg ref={svgRef} width={400} height={300}></svg>;
};

export default ElasticAnimation;