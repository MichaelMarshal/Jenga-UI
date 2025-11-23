'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'



const SystemMetrics: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState(45)
  const [memoryUsage, setMemoryUsage] = useState(67)
  const [networkIO, setNetworkIO] = useState(23)
  const [diskUsage] = useState(89)
  const [activeConnections, setActiveConnections] = useState(1247)
  const [responseTime, setResponseTime] = useState(234)

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)))
      setMemoryUsage(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)))
      setNetworkIO(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 15)))
      setActiveConnections(prev => Math.max(0, prev + Math.floor((Math.random() - 0.5) * 50)))
      setResponseTime(prev => Math.max(50, prev + Math.floor((Math.random() - 0.5) * 100)))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getHealthColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600'
    if (value >= thresholds.warning) return 'text-orange-600'
    return 'text-green-600'
  }

  const getProgressBarColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500'
    if (value >= thresholds.warning) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon, 
    thresholds, 
    description 
  }: { 
    title: string
    value: number
    unit: string
    icon: string
    thresholds: { warning: number; critical: number }
    description: string
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-end space-x-2">
            <span className={`text-3xl font-bold ${getHealthColor(value, thresholds)}`}>
              {Math.round(value)}
            </span>
            <span className="text-muted-foreground mb-1">{unit}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(value, thresholds)}`}
              style={{ width: `${Math.min(100, value)}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Disk usage approaching 90% capacity',
      timestamp: '2 minutes ago',
      icon: '⚠️'
    },
    {
      id: 2,
      type: 'info',
      message: 'Database backup completed successfully',
      timestamp: '15 minutes ago',
      icon: '✅'
    },
    {
      id: 3,
      type: 'error',
      message: 'Failed authentication attempts detected',
      timestamp: '1 hour ago',
      icon: '🚨'
    }
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500 bg-red-50'
      case 'warning': return 'border-l-orange-500 bg-orange-50'
      case 'info': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">📈 System Metrics</h2>
        <p className="text-muted-foreground">Real-time monitoring and performance analytics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={cpuUsage}
          unit="%"
          icon="🖥️"
          thresholds={{ warning: 70, critical: 85 }}
          description="Current processor utilization"
        />
        
        <MetricCard
          title="Memory Usage"
          value={memoryUsage}
          unit="%"
          icon="💾"
          thresholds={{ warning: 80, critical: 90 }}
          description="RAM utilization across system"
        />
        
        <MetricCard
          title="Network I/O"
          value={networkIO}
          unit="%"
          icon="🌐"
          thresholds={{ warning: 75, critical: 90 }}
          description="Network bandwidth utilization"
        />
        
        <MetricCard
          title="Disk Usage"
          value={diskUsage}
          unit="%"
          icon="💿"
          thresholds={{ warning: 80, critical: 90 }}
          description="Storage capacity used"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeConnections.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">Current active user sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{responseTime}ms</div>
            <p className="text-sm text-muted-foreground mt-1">Average API response time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🔄</span>
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">99.9%</div>
            <p className="text-sm text-muted-foreground mt-1">System availability (30 days)</p>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>🚨 System Alerts</CardTitle>
          <CardDescription>Recent system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border-l-4 rounded-r-lg ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{alert.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Performance Trends</CardTitle>
          <CardDescription>Historical system performance over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">↗️ +5%</p>
              <p className="text-sm text-muted-foreground">Throughput</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">↘️ -12ms</p>
              <p className="text-sm text-muted-foreground">Latency</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">↗️ +23</p>
              <p className="text-sm text-muted-foreground">Connections</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">↗️ +0.1%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SystemMetrics