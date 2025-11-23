'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PipelineStage {
  id: string
  name: string
  status: 'running' | 'completed' | 'error' | 'pending'
  processed: number
  total: number
  duration: string
}

const mockPipelineData: PipelineStage[] = [
  {
    id: '1',
    name: 'Data Ingestion',
    status: 'completed',
    processed: 15243,
    total: 15243,
    duration: '2.3s'
  },
  {
    id: '2',
    name: 'Data Validation',
    status: 'running',
    processed: 12890,
    total: 15243,
    duration: '1.8s'
  },
  {
    id: '3',
    name: 'Data Transformation',
    status: 'pending',
    processed: 0,
    total: 15243,
    duration: '--'
  },
  {
    id: '4',
    name: 'Data Normalization',
    status: 'pending',
    processed: 0,
    total: 15243,
    duration: '--'
  },
  {
    id: '5',
    name: 'Data Storage',
    status: 'pending',
    processed: 0,
    total: 15243,
    duration: '--'
  }
]

const DataPipeline: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<PipelineStage[]>(mockPipelineData)
  const [isProcessing] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineData(prev => 
        prev.map(stage => {
          if (stage.status === 'running' && stage.processed < stage.total) {
            return {
              ...stage,
              processed: Math.min(stage.processed + Math.floor(Math.random() * 100), stage.total)
            }
          }
          return stage
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'running': return 'bg-blue-500 animate-pulse'
      case 'error': return 'bg-red-500'
      case 'pending': return 'bg-gray-300'
      default: return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'running': return '🔄'
      case 'error': return '❌'
      case 'pending': return '⏳'
      default: return '⏳'
    }
  }

  const getProgressPercentage = (processed: number, total: number) => {
    return Math.round((processed / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🔄 Data Pipeline</h2>
          <p className="text-muted-foreground">Real-time data processing and normalization</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {isProcessing ? 'Processing' : 'Idle'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">15,243</div>
            <p className="text-xs text-muted-foreground">+2.3% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Processing Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">124/min</div>
            <p className="text-xs text-muted-foreground">Average throughput</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Queue Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">87</div>
            <p className="text-xs text-muted-foreground">Pending items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0.02%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Stages</CardTitle>
          <CardDescription>Current status of data processing stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.id} className="relative">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(stage.status)}`}></div>
                      <span className="text-2xl">{getStatusIcon(stage.status)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stage.processed.toLocaleString()} / {stage.total.toLocaleString()} records
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{getProgressPercentage(stage.processed, stage.total)}%</p>
                      <p className="text-sm text-muted-foreground">{stage.duration}</p>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${getStatusColor(stage.status)}`}
                        style={{ width: `${getProgressPercentage(stage.processed, stage.total)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {index < pipelineData.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-green-600">✅</span>
              <span className="text-muted-foreground">14:32</span>
              <span>Batch processing completed - 1,240 records normalized</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-blue-600">🔄</span>
              <span className="text-muted-foreground">14:28</span>
              <span>Data validation started for incoming batch</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-green-600">✅</span>
              <span className="text-muted-foreground">14:15</span>
              <span>API integration successful - 856 new records ingested</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-orange-600">⚠️</span>
              <span className="text-muted-foreground">13:45</span>
              <span>Performance alert: Processing time increased by 15%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataPipeline