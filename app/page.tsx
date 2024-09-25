// App Component in app/page.tsx
'use client'
import React, { useState } from 'react';
import VectorArithmetic from './components/VectorArithmetic';
import VectorVisualization from './components/VectorVisualization';
import VectorOperation from './types/vectorInterfaces';

/**
 * App Component serves as the main entry point of the application.
 * It manages the state of vector operations and renders the VectorArithmetic
 * and VectorVisualization components side by side.
 *
 * @returns {JSX.Element} The main application layout.
 */
const App: React.FC = () => {
  // State to hold the current vector operation
  const [operation, setOperation] = useState<VectorOperation | null>(null);

  /**
   * Handles the computation of a new vector operation.
   *
   * @param {VectorOperation} newOperation - The newly computed vector operation.
   */
  const handleCompute = (newOperation: VectorOperation) => {
    setOperation(newOperation);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Application Title */}
        <h1 className="text-4xl font-bold text-center text-primary mb-12">
          Transformer Insight Explorer
        </h1>
        {/* Grid layout for VectorArithmetic and VectorVisualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card shadow-lg rounded-lg p-6">
            {/* VectorArithmetic Component for performing vector operations */}
            <VectorArithmetic onCompute={handleCompute} />
          </div>
          <div className="bg-card shadow-lg rounded-lg p-6">
            {/* VectorVisualization Component for displaying vector operations */}
            <VectorVisualization operation={operation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;