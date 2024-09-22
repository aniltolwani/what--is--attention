import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BezierCurveProps {
    controlPointX: number;
    controlPointY: number;
}

const BezierCurve: React.FC<BezierCurveProps> = ({ controlPointX, controlPointY }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg.append("path")
            .attr("d", d3.line().curve(d3.curveBasis)([
                [100, 100],
                [controlPointX, controlPointY],
                [300, 100]
            ]) as string)
            .attr("stroke", "orange")
            .attr("fill", "none")
            .attr("stroke-width", 3);
    }, [controlPointX, controlPointY]);

    return <svg ref={svgRef} width={400} height={300}></svg>;
};

export default BezierCurve;