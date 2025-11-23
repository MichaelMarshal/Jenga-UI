'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Settings, Zap, Database, Link, Plus, Edit, Copy, Download, Upload, X, AlertTriangle, CheckCircle } from 'lucide-react'

interface APIConfigModalProps {
  mcpConnections: any[]
  apiIntegrations: any[]
  onClose: () => void
  onSaveConfig: (config: any) => void
}

const APIConfigModal: React.FC<APIConfigModalProps> = ({
  mcpConnections,
  apiIntegrations,
  onClose,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState('platform')

  const tabs = [
    { id: 'platform', label: 'Platform Access', icon: Link },
    { id: 'mcp', label: 'MCP Connections', icon: Database },
    { id: 'api', label: 'API Integrations', icon: Zap },
    { id: 'export', label: 'Import/Export', icon: Settings }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-red-400'
      case 'error': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'inactive':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    }
  }

  const handleExportConfig = () => {
    const config = {
      mcpConnections: mcpConnections,
      apiIntegrations: apiIntegrations,
      exportDate: new Date().toISOString(),
      version: "1.0"
    }
    
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `jenga-ai-config-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const handleImportConfig = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string)
            onSaveConfig(config)
            console.log('Configuration imported successfully')
          } catch (error) {
            console.error('Error parsing configuration file:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const renderPlatformTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Connect to Jenga AI Platform</h3>
        <p className="text-slate-400">Use these credentials to connect your applications to our AI platform</p>
      </div>

      {/* API Endpoint */}
      <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Platform API Endpoint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium">Base URL</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 bg-slate-800 text-cyan-300 px-3 py-2 rounded-lg text-sm font-mono">
                  https://api.jenga-ai.com/v1
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('https://api.jenga-ai.com/v1')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium">WebSocket Endpoint</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 bg-slate-800 text-cyan-300 px-3 py-2 rounded-lg text-sm font-mono">
                  wss://ws.jenga-ai.com/v1
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('wss://ws.jenga-ai.com/v1')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium">API Key</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 bg-slate-800 text-purple-300 px-3 py-2 rounded-lg text-sm font-mono">
                  jng_sk_1234567890abcdef1234567890abcdef
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('jng_sk_1234567890abcdef1234567890abcdef')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Include in Authorization header: Bearer jng_sk_...</p>
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium">Organization ID</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 bg-slate-800 text-purple-300 px-3 py-2 rounded-lg text-sm font-mono">
                  org-jenga-ai-demo-12345
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('org-jenga-ai-demo-12345')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCP Server Configuration */}
      <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            MCP Server Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium">MCP Server URL</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 bg-slate-800 text-emerald-300 px-3 py-2 rounded-lg text-sm font-mono">
                  mcp://mcp.jenga-ai.com:8080
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('mcp://mcp.jenga-ai.com:8080')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium">Connection String</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 bg-slate-800 text-emerald-300 px-3 py-2 rounded-lg text-sm font-mono break-all">
                  mcp://org-jenga-ai-demo-12345:jng_sk_1234567890abcdef@mcp.jenga-ai.com:8080/v1
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('mcp://org-jenga-ai-demo-12345:jng_sk_1234567890abcdef@mcp.jenga-ai.com:8080/v1')}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Examples */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quick Setup Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-slate-300 font-medium mb-2">cURL Example</h4>
              <code className="block bg-slate-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`curl -X POST https://api.jenga-ai.com/v1/chat/completions \
  -H "Authorization: Bearer jng_sk_1234567890abcdef1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jenga-ai-pro",
    "messages": [
      {"role": "user", "content": "Hello, Jenga AI!"}
    ]
  }'`}
              </code>
            </div>
            <div>
              <h4 className="text-slate-300 font-medium mb-2">Python Example</h4>
              <code className="block bg-slate-900 text-blue-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`import requests

headers = {
    "Authorization": "Bearer jng_sk_1234567890abcdef1234567890abcdef",
    "Content-Type": "application/json"
}

data = {
    "model": "jenga-ai-pro",
    "messages": [
        {"role": "user", "content": "Hello, Jenga AI!"}
    ]
}

response = requests.post(
    "https://api.jenga-ai.com/v1/chat/completions",
    headers=headers,
    json=data
)`}
              </code>
            </div>
            <div>
              <h4 className="text-slate-300 font-medium mb-2">Node.js Example</h4>
              <code className="block bg-slate-900 text-yellow-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`const response = await fetch('https://api.jenga-ai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer jng_sk_1234567890abcdef1234567890abcdef',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'jenga-ai-pro',
    messages: [
      { role: 'user', content: 'Hello, Jenga AI!' }
    ]
  })
})

const data = await response.json()`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMCPTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">MCP Connections</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Connection
        </Button>
      </div>

      {mcpConnections.map((connection) => (
        <Card key={connection.id} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(connection.status)}
                <div>
                  <h4 className="text-white font-medium">{connection.name}</h4>
                  <p className="text-slate-400 text-sm">{connection.description}</p>
                  <code className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded mt-1 block">
                    {connection.endpoint}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${getStatusColor(connection.status)}`}>
                  {connection.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-slate-400">
              Last sync: {new Date(connection.lastSync).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderAPITab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">API Integrations</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {apiIntegrations.map((api) => (
        <Card key={api.id} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(api.status)}
                <div>
                  <h4 className="text-white font-medium">{api.name}</h4>
                  <p className="text-slate-400 text-sm">{api.description}</p>
                  <code className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded mt-1 block">
                    {api.endpoint}
                  </code>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${getStatusColor(api.status)}`}>
                  {api.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Rate Limit:</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-slate-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-1 rounded-full"
                    style={{ width: `${(api.rateLimit.used / api.rateLimit.requests) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs">
                  {api.rateLimit.used}/{api.rateLimit.requests} per {api.rateLimit.window}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderExportTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Configuration Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Download className="w-5 h-5 text-cyan-400" />
                <h4 className="text-white font-medium">Export Configuration</h4>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Download your current API and MCP configurations as a JSON file.
              </p>
              <Button
                onClick={handleExportConfig}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="w-5 h-5 text-purple-400" />
                <h4 className="text-white font-medium">Import Configuration</h4>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Upload a configuration file to restore your API and MCP settings.
              </p>
              <Button
                onClick={handleImportConfig}
                variant="outline"
                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Config
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-3">Share Configuration</h4>
          <p className="text-slate-400 text-sm mb-4">
            Copy your configuration to clipboard to share with team members or backup.
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                const config = { mcpConnections, apiIntegrations }
                navigator.clipboard.writeText(JSON.stringify(config, null, 2))
              }}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-5xl max-h-[90vh] bg-slate-900/95 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        <CardHeader className="border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">API & MCP Configuration</CardTitle>
                <p className="text-slate-400 text-sm">Manage your integrations and connections</p>
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

        <div className="flex flex-col sm:flex-row h-[70vh]">
          {/* Sidebar */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-700/50 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full justify-start text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border-l-2 border-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              {activeTab === 'platform' && renderPlatformTab()}
              {activeTab === 'mcp' && renderMCPTab()}
              {activeTab === 'api' && renderAPITab()}
              {activeTab === 'export' && renderExportTab()}
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default APIConfigModal