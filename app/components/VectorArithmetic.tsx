// VectorArithmetic Component in app/components/VectorArithmetic.tsx
'use client';

import React, { useState } from 'react';
import { embeddings } from '../src/embeddings';
import VectorOperation from '../types/vectorInterfaces';

// Define types for select options and component props
interface OptionType {
  label: string;
  value: string;
}

// Define the props for VectorArithmetic component
interface VectorArithmeticProps {
  onCompute: (operation: VectorOperation) => void;
}

// Define operator options available for vector operations
const operatorOptions: OptionType[] = [
  { label: '+', value: '+' },
  { label: '-', value: '-' },
];

/**
 * VectorArithmetic component allows users to perform vector operations on word embeddings.
 * It provides a UI for selecting words and operators, then computes the result.
 *
 * @param {VectorArithmeticProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered VectorArithmetic component.
 */
const VectorArithmetic: React.FC<VectorArithmeticProps> = ({ onCompute }) => {
  // State hooks for managing selected words and operators
  const [selectedWord1, setSelectedWord1] = useState<string>('');
  const [selectedWord2, setSelectedWord2] = useState<string>('');
  const [selectedBaseWord, setSelectedBaseWord] = useState<string>('');
  const [operator1, setOperator1] = useState<string>('');
  const [operator2, setOperator2] = useState<string>('');
  
  // Create options for word selection from embeddings
  const wordOptions: OptionType[] = Object.keys(embeddings).map((word) => ({
    label: word,
    value: word,
  }));

  /**
   * Handles the vector computation when the compute button is clicked.
   * Performs element-wise addition or subtraction based on the selected operators.
   */
  const handleComputeClick = () => {
    if (selectedWord1 && operator1 && selectedWord2 && operator2 && selectedBaseWord) {
      const vector1 = embeddings[selectedWord1 as keyof typeof embeddings];
      const vector2 = embeddings[selectedWord2 as keyof typeof embeddings];
      const baseVector = embeddings[selectedBaseWord as keyof typeof embeddings];

      // Initialize intermediate and final result arrays
      let intermediateResult: number[] = [];
      let finalResult: number[] = [];

      // Compute (vector1 op1 vector2)
      for (let i = 0; i < vector1.length; i++) {
        intermediateResult[i] = operator1 === '+' ? vector1[i] + vector2[i] : vector1[i] - vector2[i];
      }

      // Compute (intermediate_result op2 baseVector)
      for (let i = 0; i < intermediateResult.length; i++) {
        finalResult[i] = operator2 === '+' ? baseVector[i] + intermediateResult[i] : baseVector[i] - intermediateResult[i];
      }

      // Create the operation object with all relevant vectors and details
      const operation: VectorOperation = {
        resultVector: finalResult,
        vector1: vector1,
        vector1Name: selectedWord1,
        operator1,
        vector2: vector2,
        vector2Name: selectedWord2,
        operator2,
        baseVector: baseVector,
        baseVectorName: selectedBaseWord,
        intermediateVector: intermediateResult
      };

      // Invoke the callback to pass the operation data to the parent component
      onCompute(operation);
    }
  };

  return (
    <div className="vector-arithmetic bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vector Operations</h2>
      {/* Form for selecting vectors and operators */}
      <div className="select-container">
        <select
          value={selectedWord1}
          onChange={(e) => setSelectedWord1(e.target.value)}
          className="border border-input bg-background text-foreground rounded-md p-2"
        >
          <option value="" disabled>Select Vector 1</option>
          {wordOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={operator1}
          onChange={(e) => setOperator1(e.target.value)}
          className="border border-input bg-background text-foreground rounded-md p-2"
        >
          <option value="" disabled>Select Operator 1</option>
          {operatorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedWord2}
          onChange={(e) => setSelectedWord2(e.target.value)}
          className="border border-input bg-background text-foreground rounded-md p-2"
        >
          <option value="" disabled>Select Vector 2</option>
          {wordOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={operator2}
          onChange={(e) => setOperator2(e.target.value)}
          className="border border-input bg-background text-foreground rounded-md p-2"
        >
          <option value="" disabled>Select Operator 2</option>
          {operatorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedBaseWord}
          onChange={(e) => setSelectedBaseWord(e.target.value)}
          className="border border-input bg-background text-foreground rounded-md p-2"
        >
          <option value="" disabled>Select Base Vector</option>
          {wordOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {/* Compute Button to trigger the vector operation */}
      <Button
        onClick={handleComputeClick}
        disabled={!selectedWord1 || !operator1 || !selectedWord2 || !operator2 || !selectedBaseWord}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Compute
      </Button>
    </div>
  );
};

export default VectorArithmetic;