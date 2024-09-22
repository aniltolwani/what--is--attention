"use client";

import React, { useState } from 'react';
import BezierCurve from './components/BezierCurve';
import ElasticAnimation from './components/ElasticAnimation';
import DimensionalDepth from './components/DimensionalDepth';
import ForceDirectedGraph from './components/ForceDirectedGraph';
import ReactSpringAnimation from './components/ReactSpringAnimation';
import ReactThreeFiberVisualization from './components/ReactThreeFiberVisualization';
import Heatmap from './components/Heatmap';
import ChordDiagram from './components/ChordDiagram';
import SankeyDiagram from './components/SankeyDiagram';
import VoronoiDiagram from './components/VoronoiDiagram';
import './styles/WordEmbeddingVisualization.css';

const AppPage: React.FC = () => {
    const [bezierControlX, setBezierControlX] = useState(200);
    const [bezierControlY, setBezierControlY] = useState(200);
    const [elasticTension, setElasticTension] = useState(200);
    const [elasticFriction, setElasticFriction] = useState(10);
    const [forceDistance, setForceDistance] = useState(100);

    const attentionWeights = [
        [0.1, 0.2, 0.3, 0.4, 0.5],
        [0.2, 0.3, 0.4, 0.5, 0.6],
        [0.3, 0.4, 0.5, 0.6, 0.7],
        [0.4, 0.5, 0.6, 0.7, 0.8],
        [0.5, 0.6, 0.7, 0.8, 0.9],
    ];

    const tokens = ['Token 1', 'Token 2', 'Token 3', 'Token 4', 'Token 5'];

    const attentionMatrix = [
        [0.1, 0.2, 0.3, 0.4, 0.5],
        [0.2, 0.3, 0.4, 0.5, 0.6],
        [0.3, 0.4, 0.5, 0.6, 0.7],
        [0.4, 0.5, 0.6, 0.7, 0.8],
        [0.5, 0.6, 0.7, 0.8, 0.9],
    ];

    const sankeyData = {
        nodes: ['Token 1', 'Token 2', 'Token 3', 'Token 4', 'Token 5'],
        links: [
            { source: 'Token 1', target: 'Token 2', value: 10 },
            { source: 'Token 1', target: 'Token 3', value: 5 },
            { source: 'Token 2', target: 'Token 4', value: 15 },
            { source: 'Token 3', target: 'Token 4', value: 10 },
            { source: 'Token 4', target: 'Token 5', value: 20 },
        ],
    };

    const voronoiPoints = [
        { x: 100, y: 200, label: 'Token 1' },
        { x: 200, y: 100, label: 'Token 2' },
        { x: 300, y: 300, label: 'Token 3' },
        { x: 400, y: 150, label: 'Token 4' },
        { x: 500, y: 250, label: 'Token 5' },
    ];

    return (
        <div className="container">
            <h1>Animation Concepts Visualization</h1>

            <section>
                <h2>1. Bezier Curves</h2>
                <BezierCurve controlPointX={bezierControlX} controlPointY={bezierControlY} />
                <label>
                    Control Point X:
                    <input
                        type="range"
                        min="100"
                        max="300"
                        value={bezierControlX}
                        onChange={(e) => setBezierControlX(Number(e.target.value))}
                    />
                </label>
                <label>
                    Control Point Y:
                    <input
                        type="range"
                        min="100"
                        max="300"
                        value={bezierControlY}
                        onChange={(e) => setBezierControlY(Number(e.target.value))}
                    />
                </label>
            </section>

            <section>
                <h2>2. Elastic Animation</h2>
                <ElasticAnimation tension={elasticTension} friction={elasticFriction} />
                <label>
                    Tension:
                    <input
                        type="range"
                        min="100"
                        max="300"
                        value={elasticTension}
                        onChange={(e) => setElasticTension(Number(e.target.value))}
                    />
                </label>
                <label>
                    Friction:
                    <input
                        type="range"
                        min="5"
                        max="20"
                        value={elasticFriction}
                        onChange={(e) => setElasticFriction(Number(e.target.value))}
                    />
                </label>
            </section>

            <section>
                <h2>3. Dimensional Depth</h2>
                <DimensionalDepth />
            </section>

            <section>
                <h2>4. Force-Directed Graph</h2>
                <ForceDirectedGraph distance={forceDistance} />
                <label>
                    Link Distance:
                    <input
                        type="range"
                        min="50"
                        max="200"
                        value={forceDistance}
                        onChange={(e) => setForceDistance(Number(e.target.value))}
                    />
                </label>
            </section>

            <section>
                <h2>5. React Spring Animation</h2>
                <ReactSpringAnimation />
            </section>

            <section>
                <h2>6. React Three Fiber Visualization</h2>
                <ReactThreeFiberVisualization />
            </section>

            <section>
                <h2>7. Attention Heatmap</h2>
                <Heatmap data={attentionWeights} labels={tokens} />
            </section>

            <section>
                <h2>8. Attention Chord Diagram</h2>
                <ChordDiagram matrix={attentionMatrix} labels={tokens} />
            </section>

            <section>
                <h2>9. Attention Sankey Diagram</h2>
                <SankeyDiagram data={sankeyData} />
            </section>

            <section>
                <h2>10. Voronoi Diagram</h2>
                <VoronoiDiagram points={voronoiPoints} />
            </section>
        </div>
    );
};

export default AppPage;