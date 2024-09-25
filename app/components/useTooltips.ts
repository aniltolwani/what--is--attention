import { useEffect } from 'react';
import * as d3 from 'd3';
import { NearestWord } from '../types/vectorInterfaces';

export const useTooltips = (animationComplete: boolean, nearestWords: NearestWord[]) => {
  useEffect(() => {
    if (animationComplete) {
      const tooltipContent = nearestWords.map(d => {
        const color = d3.interpolateReds(1 - d.distance / d3.max(nearestWords, d => d.distance)!);
        return `<div style="background-color: ${color}; padding: 5px; border-radius: 3px;">
                  <strong>Rank:</strong> ${d.rank}<br/>
                  <strong>Word:</strong> ${d.word}<br/>
                  <strong>Distance:</strong> ${d.distance.toFixed(4)}
                </div>`;
      }).join('');

      d3.select(".result-vector-tooltip")
        .attr("data-tooltip-content", tooltipContent);
    }
  }, [animationComplete, nearestWords]);

  useEffect(() => {
    nearestWords.forEach(wordData => {
      const selector = `circle.nearest-point[data-tooltip-id="${wordData.word}-tooltip"]`;
      d3.select(selector).on("mouseover", () => {
        // Additional hover effects can be added here if needed
      });
    });
  }, [nearestWords]);
};