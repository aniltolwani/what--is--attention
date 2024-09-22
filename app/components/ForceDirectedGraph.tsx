import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Define a Node interface that extends SimulationNodeDatum
interface Node extends d3.SimulationNodeDatum {
    id: string;
}

interface Link {
    source: string;
    target: string;
}

interface ForceDirectedGraphProps {
    distance: number;
}

const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({ distance }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 400;
        const height = 300;

        const nodes: Node[] = [
            { id: 'A' },
            { id: 'B' },
            { id: 'C' },
            { id: 'D' }
        ];

        const links: Link[] = [
            { source: 'A', target: 'B' },
            { source: 'A', target: 'C' },
            { source: 'B', target: 'D' },
            { source: 'C', target: 'D' }
        ];

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2);

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", "red")
            .call(
                d3.drag<SVGCircleElement, Node>()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

        const simulation = d3.forceSimulation<Node>(nodes)
            .force("charge", d3.forceManyBody().strength(-200))
            .force("link", d3.forceLink<Node, Link>(links)
                .id(d => d.id)
                .distance(distance)
            )
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as Node).x ?? 0)
                .attr("y1", d => (d.source as Node).y ?? 0)
                .attr("x2", d => (d.target as Node).x ?? 0)
                .attr("y2", d => (d.target as Node).y ?? 0);

            node
                .attr("cx", d => d.x ?? 0)
                .attr("cy", d => d.y ?? 0);
        });

        function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, unknown>, d: Node) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [distance]);

    return <svg ref={svgRef} width={400} height={300}></svg>;
};

export default ForceDirectedGraph;