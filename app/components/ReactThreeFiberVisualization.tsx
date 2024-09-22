import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Token: React.FC = () => {
    return (
        <mesh position={[1, 1, 1]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
};

const ReactThreeFiberVisualization: React.FC = () => {
    return (
        <Canvas style={{ height: '300px', background: '#f0f0f0' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Token />
            <OrbitControls />
        </Canvas>
    );
};

export default ReactThreeFiberVisualization;