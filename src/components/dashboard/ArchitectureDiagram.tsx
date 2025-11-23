'use client'

import React, { useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionMode,
  Node,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '👤 User Login' },
    position: { x: 50, y: 100 },
    style: { background: '#e3f2fd', border: '2px solid #1976d2', borderRadius: '8px' },
  },
  {
    id: '2',
    data: { label: '🔐 Authentication\nGuard' },
    position: { x: 300, y: 100 },
    style: { background: '#f3e5f5', border: '2px solid #7b1fa2', borderRadius: '8px' },
  },
  {
    id: '3',
    data: { label: '⚛️ React UI\n(Frontend)' },
    position: { x: 550, y: 100 },
    style: { background: '#e8f5e8', border: '2px solid #388e3c', borderRadius: '8px' },
  },
  {
    id: '4',
    data: { label: '🔄 API Layer\n(Backend)' },
    position: { x: 300, y: 300 },
    style: { background: '#fff3e0', border: '2px solid #f57c00', borderRadius: '8px' },
  },
  {
    id: '5',
    data: { label: '🗄️ RAS Database\n(Redis/Auth/Storage)' },
    position: { x: 50, y: 500 },
    style: { background: '#fce4ec', border: '2px solid #c2185b', borderRadius: '8px' },
  },
  {
    id: '6',
    data: { label: '📊 Data Pipeline\n(Processing)' },
    position: { x: 550, y: 500 },
    style: { background: '#e1f5fe', border: '2px solid #0277bd', borderRadius: '8px' },
  },
  {
    id: '7',
    data: { label: '🔍 Data Normalization' },
    position: { x: 300, y: 650 },
    style: { background: '#f9fbe7', border: '2px solid #689f38', borderRadius: '8px' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Login Request' },
  { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Authorized' },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'API Calls' },
  { id: 'e4-5', source: '4', target: '5', animated: true, label: 'Store/Retrieve' },
  { id: 'e4-6', source: '4', target: '6', animated: true, label: 'Process Data' },
  { id: 'e6-7', source: '6', target: '7', animated: true, label: 'Normalize' },
  { id: 'e5-7', source: '5', target: '7', animated: false, label: 'Raw Data' },
]

const ArchitectureDiagram: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            System Architecture Overview
          </CardTitle>
          <CardDescription>
            Interactive diagram showing the complete system architecture from your whiteboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] border rounded-lg bg-gray-50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              connectionMode={ConnectionMode.Loose}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant={'dots' as any} gap={12} size={1} />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div>
              <h4 className="font-medium">Frontend Layer</h4>
              <p className="text-sm text-muted-foreground">React UI with authentication</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div>
              <h4 className="font-medium">API Layer</h4>
              <p className="text-sm text-muted-foreground">Backend processing and routing</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-pink-500 rounded"></div>
            <div>
              <h4 className="font-medium">Data Layer</h4>
              <p className="text-sm text-muted-foreground">RAS Database and processing</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ArchitectureDiagram