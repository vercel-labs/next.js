'use client'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { motion } from 'framer-motion'
import dagre from 'dagre'

const g = new dagre.graphlib.Graph()
g.setDefaultEdgeLabel(() => ({}))

export default function Graph() {
  return (
    <motion.div style={{ width: 600, height: 400 }} animate={{ opacity: 1 }}>
      <ReactFlow nodes={[{ id: '1', position: { x: 0, y: 0 }, data: { label: 'a' } }]} edges={[]}>
        <Background />
        <Controls />
      </ReactFlow>
    </motion.div>
  )
}
