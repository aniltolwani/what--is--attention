"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightIcon, PlusIcon, MinusIcon } from "lucide-react"
import { VT323 } from 'next/font/google'

type Vector = [number, number]

const wordVectors: Record<string, Vector> = {
  man: [1, 1],
  woman: [-1, 1],
  king: [2, 2],
  queen: [0, 2],
  boy: [0.5, 0.5],
  girl: [-0.5, 0.5],
  prince: [1.5, 1.5],
  princess: [-0.5, 1.5],
  father: [1.2, 0.8],
  mother: [-1.2, 0.8],
}

const VectorArithmetic: React.FC = () => {
  const [expression, setExpression] = useState<(string | '+' | '-')[]>([])
  const [baseVector, setBaseVector] = useState<Vector | null>(null)
  const [directionVector, setDirectionVector] = useState<Vector | null>(null)
  const [resultVector, setResultVector] = useState<Vector | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  const addToExpression = (word: string) => {
    if (expression.length < 5) {
      setExpression([...expression, word])
    }
  }

  const addOperator = (op: '+' | '-') => {
    if (expression.length % 2 === 1 && expression.length < 4) {
      setExpression([...expression, op])
    }
  }

  const calculateResult = () => {
    if (expression.length !== 5) return

    const [word1, op1, word2, op2, word3] = expression
    const vec1 = wordVectors[word1 as string]
    const vec2 = wordVectors[word2 as string]
    const vec3 = wordVectors[word3 as string]

    if (!vec1 || !vec2 || !vec3) return

    const direction: Vector = [
      vec1[0] - vec2[0],
      vec1[1] - vec2[1]
    ]
    
    const result: Vector = [
      op2 === '+' ? vec3[0] + direction[0] : vec3[0] - direction[0],
      op2 === '+' ? vec3[1] + direction[1] : vec3[1] - direction[1]
    ]

    setBaseVector(vec3)
    setDirectionVector(direction)
    setResultVector(result)
    setAnimationStep(0)
  }

  const clearExpression = () => {
    setExpression([]);
    setBaseVector(null);
    setDirectionVector(null);
    setResultVector(null);
    setAnimationStep(0);
  };

  useEffect(() => {
    if (baseVector && directionVector) {
      const timer = setInterval(() => {
        setAnimationStep((prev) => {
          if (prev >= 4) {
            clearInterval(timer)
            return prev
          }
          return prev + 1
        })
      }, 1500)

      return () => clearInterval(timer)
    }
  }, [baseVector, directionVector])

  const vectorToPosition = (vector: Vector): { left: string, top: string } => ({
    left: `${(vector[0] + 3) * 10}%`,
    top: `${100 - (vector[1] + 3) * 10}%`,
  })

  const findSimilarWords = (vector: Vector): string[] => {
    return Object.entries(wordVectors)
      .map(([word, vec]) => ({
        word,
        distance: Math.sqrt(Math.pow(vec[0] - vector[0], 2) + Math.pow(vec[1] - vector[1], 2))
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map(item => item.word)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Vector Arithmetic Interface</h1>
      
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Select onValueChange={addToExpression}>
          <SelectTrigger className="w-[180px] bg-white shadow-md hover:shadow-lg transition-shadow">
            <SelectValue placeholder="Select a word" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.keys(wordVectors).map((word) => (
              <SelectItem key={word} value={word}>{word}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={() => addOperator('+')} 
          disabled={expression.length % 2 === 0 || expression.length >= 4}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
        <Button 
          onClick={() => addOperator('-')} 
          disabled={expression.length % 2 === 0 || expression.length >= 4}
          className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
        
        <Button 
          onClick={calculateResult} 
          className="bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-xl transition-all" 
          disabled={expression.length !== 5}
        >
          Calculate <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>

        <Button 
          onClick={clearExpression}
          className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-xl transition-all"
        >
          Clear
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">Expression:</h2>
        <Input value={expression.join(' ')} readOnly className="text-lg bg-white shadow-inner" />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-700">Vector Visualization:</h2>
        <div className="relative h-[800px] border border-gray-300 bg-white rounded-lg shadow-inner overflow-hidden">
          {Object.entries(wordVectors).map(([word, vector]) => {
            const { left, top } = vectorToPosition(vector)
            return (
              <div key={word} className="absolute" style={{ left, top }}>
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm" />
                <span className="absolute left-4 top-0 text-sm text-gray-600">{word}</span>
              </div>
            )
          })}
          
          <AnimatePresence>
            {directionVector && animationStep >= 1 && (
              <motion.svg
                className="absolute top-0 left-0 w-full h-full"
                initial={{ opacity: 1 }}
                animate={{ opacity: animationStep >= 3 ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.line
                  x1={`${(wordVectors[expression[0] as string][0] + 3) * 10}%`}
                  y1={`${100 - (wordVectors[expression[0] as string][1] + 3) * 10}%`}
                  x2={`${(wordVectors[expression[2] as string][0] + 3) * 10}%`}
                  y2={`${100 - (wordVectors[expression[2] as string][1] + 3) * 10}%`}
                  stroke="orange"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
                <motion.polygon
                  points="0,-6 12,0 0,6"
                  fill="orange"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  transform={`translate(${(wordVectors[expression[2] as string][0] + 3) * 10}%, ${100 - (wordVectors[expression[2] as string][1] + 3) * 10}%) rotate(${Math.atan2(directionVector[1], directionVector[0]) * 180 / Math.PI})`}
                />
              </motion.svg>
            )}

            {baseVector && animationStep >= 2 && (
              <motion.div
                className="absolute"
                style={vectorToPosition(baseVector)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm" />
                <span className="absolute left-4 top-0 text-sm font-bold text-green-700">Base</span>
              </motion.div>
            )}

            {baseVector && directionVector && animationStep >= 3 && (
              <motion.svg
                className="absolute top-0 left-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.line
                  x1={`${(wordVectors[expression[0] as string][0] + 3) * 10}%`}
                  y1={`${100 - (wordVectors[expression[0] as string][1] + 3) * 10}%`}
                  x2={`${(wordVectors[expression[2] as string][0] + 3) * 10}%`}
                  y2={`${100 - (wordVectors[expression[2] as string][1] + 3) * 10}%`}
                  stroke="orange"
                  strokeWidth="2"
                  initial={{
                    x1: `${(wordVectors[expression[0] as string][0] + 3) * 10}%`,
                    y1: `${100 - (wordVectors[expression[0] as string][1] + 3) * 10}%`,
                    x2: `${(wordVectors[expression[2] as string][0] + 3) * 10}%`,
                    y2: `${100 - (wordVectors[expression[2] as string][1] + 3) * 10}%`,
                  }}
                  animate={{
                    x1: `${(baseVector[0] + 3) * 10}%`,
                    y1: `${100 - (baseVector[1] + 3) * 10}%`,
                    x2: `${(baseVector[0] + (expression[3] === '-' ? -directionVector[0] : directionVector[0]) + 3) * 10}%`,
                    y2: `${100 - (baseVector[1] + (expression[3] === '-' ? -directionVector[1] : directionVector[1]) + 3) * 10}%`,
                    stroke: ["orange", "red"],
                  }}
                  transition={{ duration: 1 }}
                />
                <motion.polygon
                  points="0,-6 12,0 0,6"
                  fill="red"
                  initial={{
                    opacity: 0,
                    transform: `translate(${(wordVectors[expression[2] as string][0] + 3) * 10}%, ${100 - (wordVectors[expression[2] as string][1] + 3) * 10}%) rotate(${Math.atan2(directionVector[1], directionVector[0]) * 180 / Math.PI})`,
                  }}
                  animate={{
                    opacity: 1,
                    transform: `translate(${(baseVector[0] + (expression[3] === '-' ? -directionVector[0] : directionVector[0]) + 3) * 10}%, ${100 - (baseVector[1] + (expression[3] === '-' ? -directionVector[1] : directionVector[1]) + 3) * 10}%) rotate(${Math.atan2(expression[3] === '-' ? -directionVector[1] : directionVector[1], expression[3] === '-' ? -directionVector[0] : directionVector[0]) * 180 / Math.PI})`,
                  }}
                  transition={{ duration: 1 }}
                />
              </motion.svg>
            )}

            {resultVector && animationStep >= 4 && (
              <motion.div
                className="absolute"
                style={vectorToPosition(resultVector)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-5 h-5 bg-purple-500 rounded-full shadow-sm cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                <span className="absolute left-6 top-0 text-sm font-bold text-purple-700">Result</span>
                {showTooltip && (
                  <div
                    className="absolute left-6 top-6 bg-white border border-gray-300 rounded-lg p-3 z-10 shadow-lg"
                  >
                    <h3 className="font-bold mb-2 text-gray-800">Closest words:</h3>
                    <ul className="space-y-1">
                      {findSimilarWords(resultVector).map((word) => (
                        <li key={word} className="text-gray-600">{word}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default VectorArithmetic

// a few more ideas:
// - make the animation smoother, make it an actual tip to tail arrow
// - multi expression support take v1 v2, apply to v3, take that result, apply to v4, and so on
// - make it so you can click on a word and it highlights the word and the arrows leading to it and from it
// - make a nice animation when the movement animation is finished, the dots that are nearby in semantic space fade in
// - make the arrows thicker
// - make the bubbles for result and base smaller / fix the issue where text goes on to both
// - add a reset button to clear the current expression and results
// - implement a history feature to view past calculations
// - support for more natural language, so instead of v1 v2 - v3 you can do things like "king is to queen as man is to ______"
// "random" button that makes a random expression and calculates it
// challenge mode - you can only use a certain number of words from the original set


// most important:
// 1. make the animation smoother, make it an actual tip to tail arrow
// 2. make a nice animation when the movement animation is finished, the dots that are nearby in semantic space fade in
// 4. natural language support: "king is to queen as man is to ______"