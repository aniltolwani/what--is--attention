'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html, Line } from '@react-three/drei'
import { Vector3, Color } from 'three'
import { motion } from 'framer-motion-3d'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

// Expanded fake data for word embeddings across layers
const wordEmbeddings = {
  king: { layer1: [1, 0.5, 0.2], layer2: [1.1, 0.6, 0.3], layer3: [1.2, 0.7, 0.4] },
  queen: { layer1: [0.9, 0.6, 0.3], layer2: [1.0, 0.7, 0.4], layer3: [1.1, 0.8, 0.5] },
  man: { layer1: [0.7, 0.2, 0.1], layer2: [0.8, 0.3, 0.2], layer3: [0.9, 0.4, 0.3] },
  woman: { layer1: [0.6, 0.3, 0.2], layer2: [0.7, 0.4, 0.3], layer3: [0.8, 0.5, 0.4] },
}

const layers = ['layer1', 'layer2', 'layer3']

function WordVector({ word, position, isSelected, onClick, attention }) {
  const mesh = useRef()
  const { camera } = useThree()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (mesh.current) {
      mesh.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group position={position}>
      <motion.mesh
        ref={mesh}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <motion.meshStandardMaterial
          color={isSelected ? '#ff69b4' : '#ffa500'}
          emissive={isSelected ? '#ff69b4' : '#ffa500'}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </motion.mesh>
      <Html distanceFactor={10}>
        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {word}
        </div>
      </Html>
      {attention > 0 && (
        <motion.mesh
          scale={attention}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial transparent opacity={0.3} color="#00ffff" />
        </motion.mesh>
      )}
    </group>
  )
}

function AttentionLine({ start, end, strength }) {
  return (
    <Line
      points={[start, end]}
      color="cyan"
      lineWidth={strength * 5}
      transparent
      opacity={strength}
    />
  )
}

function VectorSpace({ currentLayer, selectedWord }) {
  const [attentionData, setAttentionData] = useState({})

  useEffect(() => {
    // Simulate attention mechanism
    if (selectedWord) {
      const newAttentionData = {}
      Object.keys(wordEmbeddings).forEach(word => {
        if (word !== selectedWord) {
          newAttentionData[word] = Math.random()
        }
      })
      setAttentionData(newAttentionData)
    } else {
      setAttentionData({})
    }
  }, [selectedWord, currentLayer])

  return (
    <>
      {Object.entries(wordEmbeddings).map(([word, layerData]) => (
        <WordVector
          key={word}
          word={word}
          position={new Vector3(...layerData[currentLayer])}
          isSelected={selectedWord === word}
          onClick={() => {}}
          attention={attentionData[word] || 0}
        />
      ))}
      {selectedWord && Object.entries(attentionData).map(([word, strength]) => (
        <AttentionLine
          key={`${selectedWord}-${word}`}
          start={new Vector3(...wordEmbeddings[selectedWord][currentLayer])}
          end={new Vector3(...wordEmbeddings[word][currentLayer])}
          strength={strength}
        />
      ))}
    </>
  )
}

export default function EnhancedWordEmbeddingVisualizer() {
  const [currentLayer, setCurrentLayer] = useState('layer1')
  const [selectedWord, setSelectedWord] = useState(null)

  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <color attach="background" args={['#111']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <VectorSpace currentLayer={currentLayer} selectedWord={selectedWord} />
        <OrbitControls />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {layers.map(layer => (
          <button
            key={layer}
            onClick={() => setCurrentLayer(layer)}
            className={`px-4 py-2 rounded-full ${
              currentLayer === layer ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        {Object.keys(wordEmbeddings).map(word => (
          <button
            key={word}
            onClick={() => setSelectedWord(word === selectedWord ? null : word)}
            className={`px-4 py-2 rounded-full ${
              selectedWord === word ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  )
}
