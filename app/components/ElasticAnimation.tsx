import React, { useRef } from 'react';
import * as d3 from 'd3';

interface ElasticAnimationProps {
    tension: number;
    friction: number;
}

const ElasticAnimation: React.FC<ElasticAnimationProps> = ({ tension, friction }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const circleRef = useRef<d3.Selection<SVGCircleElement, unknown, null, undefined> | null>(null);

    const updateAnimation = () => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        circleRef.current = svg.append("circle")
            .attr("cx", 80)
            .attr("cy", 200)
            .attr("r", 20)
            .attr("fill", "steelblue");

        const animate = () => {
            circleRef.current?.transition()
                .duration(1000)
                .ease(d3.easeElastic.period(1 / tension))
                .attr("cx", 300)
                .transition()
                .duration(1000)
                .ease(d3.easeElastic.period(1 / tension))
                .attr("cx", 50)
                .on("end", animate);
        };

        animate();
    };

    // Run the animation update on every render
    updateAnimation();

    return <svg ref={svgRef} width={400} height={300}></svg>;
};

export default ElasticAnimation;