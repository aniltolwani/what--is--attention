import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Chord, chord, ribbon, arc, scaleOrdinal, schemeCategory10 } from 'd3';

interface ChordDiagramProps {
    matrix: number[][];
    labels: string[];
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ matrix, labels }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 600;
        const outerRadius = Math.min(width, height) * 0.5 - 40;
        const innerRadius = outerRadius - 10;

        const color = scaleOrdinal<string, string>()
            .domain(labels)
            .range(schemeCategory10);

        const chordGenerator = chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        const chords: Chord = chordGenerator(matrix);

        const arcGenerator = arc<d3.ChordGenSubgroup>()!
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbonGenerator = ribbon<Chord>()!
            .radius(innerRadius);

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Draw arcs
        g.selectAll("g.group")
            .data(chords.groups)
            .enter().append("g")
            .attr("class", "group")
            .append("path")
            .style("fill", d => color(labels[d.index]) as string)
            .style("stroke", d => d3.rgb(color(labels[d.index]) as string).darker() as string)
            .attr("d", arcGenerator)
            .on("mouseover", function(event, d) {
                // Highlight the group and its chords
                d3.selectAll(".chord").style("opacity", 0.1);
                g.selectAll(".chord")
                    .filter(ch => ch.source.index === d.index || ch.target.index === d.index)
                    .style("opacity", 1);
            })
            .on("mouseout", function() {
                g.selectAll(".chord").style("opacity", 1);
            });

        // Add labels
        g.selectAll("g.group")
            .append("text")
            .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
            .attr("transform", function(d) {
                return `
                    rotate(${(d.angle * 180 / Math.PI - 90)})
                    translate(${outerRadius + 10})
                    ${d.angle > Math.PI ? "rotate(180)" : ""}
                `;
            })
            .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
            .text(d => labels[d.index]);

        // Draw chords
        g.selectAll("path.chord")
            .data(chords)
            .enter().append("path")
            .attr("class", "chord")
            .attr("d", ribbonGenerator)
            .style("fill", d => color(labels[d.target.index]) as string)
            .style("stroke", d => d3.rgb(color(labels[d.target.index]) as string).darker() as string)
            .style("opacity", 0.7);
    }, [matrix, labels]);

    return <svg ref={svgRef} width={600} height={600}></svg>;
};

export default ChordDiagram;