'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart3, Zap, Clock, TrendingUp, Activity, X } from 'lucide-react'

interface MetricsModalProps {
  user: any
  selectedModel: any
  aiModels: any[]
  onClose: () => void
}

const MetricsModal: React.FC<MetricsModalProps> = ({
  user,
  selectedModel: _selectedModel,
  aiModels,
  onClose
}) => {
  const [timeRange, setTimeRange] = useState('24h')

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const formatNumber = (num: number) => {
    if (num > 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num > 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Neural Metrics Dashboard</CardTitle>
                <p className="text-slate-400 text-sm">Real-time AI performance analytics</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <ScrollArea className="h-[70vh]">
            <div className="space-y-6">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-white text-sm">Time Range:</span>
                {['1h', '24h', '7d', '30d'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range 
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                    }
                  >
                    {range}
                  </Button>
                ))}
              </div>

              {/* Usage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-white font-semibold">Token Usage</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Used</span>
                        <span className="text-white">{formatNumber(user.usage.tokens_used)} / {formatNumber(user.usage.tokens_limit)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getUsagePercentage(user.usage.tokens_used, user.usage.tokens_limit)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {(100 - getUsagePercentage(user.usage.tokens_used, user.usage.tokens_limit)).toFixed(1)}% remaining
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Activity className="w-5 h-5 text-green-400" />
                      <h3 className="text-white font-semibold">API Calls</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Used</span>
                        <span className="text-white">{formatNumber(user.usage.api_calls)} / {formatNumber(user.usage.api_limit)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getUsagePercentage(user.usage.api_calls, user.usage.api_limit)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {(100 - getUsagePercentage(user.usage.api_calls, user.usage.api_limit)).toFixed(1)}% remaining
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Performance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span>Model Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          model.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        } animate-pulse`} />
                        <div>
                          <h4 className="text-white font-medium">{model.name}</h4>
                          <p className="text-slate-400 text-sm">{model.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">{model.usage.requests_today} requests</p>
                        <p className="text-slate-400 text-xs">{formatNumber(model.usage.tokens_today)} tokens</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-cyan-500/30">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Avg Response Time</h3>
                    <p className="text-2xl font-bold text-cyan-400">1.2s</p>
                    <p className="text-xs text-slate-400">15% faster than last week</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Success Rate</h3>
                    <p className="text-2xl font-bold text-purple-400">99.2%</p>
                    <p className="text-xs text-slate-400">+0.3% from yesterday</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Uptime</h3>
                    <p className="text-2xl font-bold text-green-400">99.9%</p>
                    <p className="text-xs text-slate-400">30 days average</p>
                  </CardContent>
                </Card>
              </div>

              {/* Export Options */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3">Export Metrics</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      Download CSV
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      Download JSON
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default MetricsModal