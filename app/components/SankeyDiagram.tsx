import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
    sankey,
    sankeyLinkHorizontal,
    SankeyGraph,
    SankeyNode,
    SankeyLink,
    SankeyExtraProperties
} from 'd3-sankey';

interface SankeyDiagramProps {
    data: {
        nodes: string[];
        links: { source: string; target: string; value: number }[];
    };
}

interface CustomSankeyNode extends SankeyExtraProperties {
    name: string;
}

interface CustomSankeyLink extends SankeyExtraProperties {
    // Add any additional properties for links if needed
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = 700;
        const height = 500;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create a mapping from node names to indices
        const nodeMap: { [key: string]: number } = {};
        data.nodes.forEach((name, index) => {
            nodeMap[name] = index;
        });

        const sankeyGenerator = sankey<CustomSankeyNode, CustomSankeyLink>()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 1], [width - 1, height - 6]]);

        const graph: SankeyGraph<CustomSankeyNode, CustomSankeyLink> = sankeyGenerator({
            nodes: data.nodes.map((name) => ({ name })),
            links: data.links.map((link) => ({
                source: nodeMap[link.source],
                target: nodeMap[link.target],
                value: link.value
            }))
        });

        // Draw links
        svg.append('g')
            .selectAll('path')
            .data(graph.links)
            .enter()
            .append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', (d) => color(d.source.name))
            .attr('stroke-width', (d) => Math.max(1, d.width || 1))
            .attr('fill', 'none')
            .attr('opacity', 0.5)
            .on('mouseover', function () {
                d3.select(this).attr('opacity', 0.8);
            })
            .on('mouseout', function () {
                d3.select(this).attr('opacity', 0.5);
            });

        // Draw nodes
        svg.append('g')
            .selectAll('rect')
            .data(graph.nodes)
            .enter()
            .append('rect')
            .attr('x', (d) => d.x0 || 0)
            .attr('y', (d) => d.y0 || 0)
            .attr('height', (d) => (d.y1 || 0) - (d.y0 || 0))
            .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
            .attr('fill', (d) => color(d.name))
            .attr('stroke', '#000')
            .append('title')
            .text((d) => `${d.name}\n${d.value}`);

        // Draw node labels
        svg.append('g')
            .style('font', '12px sans-serif')
            .selectAll('text')
            .data(graph.nodes)
            .enter()
            .append('text')
            .attr('x', (d) => (d.x0 && d.x0 < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6))
            .attr('y', (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', (d) => (d.x0 && d.x0 < width / 2 ? 'start' : 'end'))
            .text((d) => d.name);
    }, [data]);

    return <svg ref={svgRef} width={700} height={500}></svg>;
};

export default SankeyDiagram;
