"use client";

import React, { useState } from 'react';
import BezierCurve from './components/BezierCurve';
import ElasticAnimation from './components/ElasticAnimation';
import DimensionalDepth from './components/DimensionalDepth';
import ForceDirectedGraph from './components/ForceDirectedGraph';
import ReactSpringAnimation from './components/ReactSpringAnimation';
import ReactThreeFiberVisualization from './components/ReactThreeFiberVisualization';
import './styles/WordEmbeddingVisualization.css';

const AppPage: React.FC = () => {
    const [bezierControl, setBezierControl] = useState(200);
    const [elasticTension, setElasticTension] = useState(200);
    const [elasticFriction, setElasticFriction] = useState(10);
    const [forceDistance, setForceDistance] = useState(100);

    return (
        <div className="container">
            <h1>Animation Concepts Visualization</h1>

            <section>
                <h2>1. Bezier Curves</h2>
                <BezierCurve controlPointX={bezierControl} />
                <label>
                    Control Point X:
                    <input
                        type="range"
                        min="100"
                        max="300"
                        value={bezierControl}
                        onChange={(e) => setBezierControl(Number(e.target.value))}
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
        </div>
    );
};

export default AppPage;