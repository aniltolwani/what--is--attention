import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VoronoiDiagramProps {
    points: { x: number; y: number; label: string }[];
}

const VoronoiDiagram: React.FC<VoronoiDiagramProps> = ({ points }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = 600;
        const height = 600;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Transform points to [x, y] format for Delaunay
        const delaunayPoints = points.map(p => [p.x, p.y] as [number, number]);

        // Create Delaunay and Voronoi diagrams
        const delaunay = d3.Delaunay.from(delaunayPoints);
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        // Draw cells
        svg.append('g')
            .selectAll('path')
            .data(points)
            .enter()
            .append('path')
            .attr('d', (d, i) => {
                const cell = voronoi.cellPolygon(i);
                return cell ? 'M' + cell.join('L') + 'Z' : null;
            })
            .attr('fill', (d, i) => color(i.toString()) as string)
            .attr('stroke', '#000')
            .attr('opacity', 0.3)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', 0.7);
                // Optional: Show tooltip
                // You can implement a tooltip here
            })
            .on('mouseout', function () {
                d3.select(this).attr('opacity', 0.3);
            });

        // Draw points
        svg.append('g')
            .selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 5)
            .attr('fill', (d, i) => color(i.toString()) as string);
    }, [points]);

    return <svg ref={svgRef} width={600} height={600}></svg>;
};

export default VoronoiDiagram;
