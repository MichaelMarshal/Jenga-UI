'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SettingsModalProps {
  user: any
  aiModels: any[]
  mcpConnections: any[]
  apiIntegrations: any[]
  onClose: () => void
  onModelSelect: (model: any) => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  aiModels,
  mcpConnections,
  apiIntegrations,
  onClose,
  onModelSelect
}) => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'models', label: 'AI Models', icon: '🤖' },
    { id: 'mcp', label: 'MCP Connections', icon: '🔗' },
    { id: 'api', label: 'API Integrations', icon: '⚡' },
    { id: 'billing', label: 'Usage & Billing', icon: '💳' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'connected': return 'bg-blue-500'
      case 'inactive': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="text-white font-semibold text-lg">{user.name}</h3>
              <p className="text-slate-400">{user.email}</p>
              <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded-full mt-1">
                {user.plan} Plan
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm">Full Name</label>
              <input 
                type="text" 
                value={user.name} 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white mt-1"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm">Email</label>
              <input 
                type="email" 
                value={user.email} 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderModelsTab = () => (
    <div className="space-y-4">
      {aiModels.map((model) => (
        <Card key={model.id} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`} />
                <div>
                  <h4 className="text-white font-medium">{model.name}</h4>
                  <p className="text-slate-400 text-sm">{model.provider} • {model.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onModelSelect(model)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Select
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  Configure
                </Button>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Requests Today:</span>
                <span className="text-white ml-2">{model.usage.requests_today}</span>
              </div>
              <div>
                <span className="text-slate-400">Tokens Used:</span>
                <span className="text-white ml-2">{model.usage.tokens_today.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
        + Add Custom Model
      </Button>
    </div>
  )

  const renderMCPTab = () => (
    <div className="space-y-4">
      {mcpConnections.map((connection) => (
        <Card key={connection.id} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(connection.status)}`} />
                <div>
                  <h4 className="text-white font-medium">{connection.name}</h4>
                  <p className="text-slate-400 text-sm">{connection.description}</p>
                  <span className="text-xs text-slate-500">Last sync: {new Date(connection.lastSync).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={connection.status === 'active' ? 'destructive' : 'default'}
                  size="sm"
                >
                  {connection.status === 'active' ? 'Disconnect' : 'Connect'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
        + Add MCP Connection
      </Button>
    </div>
  )

  const renderAPITab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">API Integrations</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const config = {
                mcpConnections: mcpConnections,
                apiIntegrations: apiIntegrations,
                exportDate: new Date().toISOString(),
                version: "1.0"
              }
              navigator.clipboard.writeText(JSON.stringify(config, null, 2))
              console.log('Configuration exported to clipboard!')
            }}
            className="text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            📋 Export Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('Import configuration...')
            }}
            className="text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            📥 Import Config
          </Button>
        </div>
      </div>
      {apiIntegrations.map((api) => (
        <Card key={api.id} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-medium">{api.name}</h4>
                <p className="text-slate-400 text-sm">{api.description}</p>
                <code className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{api.endpoint}</code>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(api.status)}`} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  Manage
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
      
      <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
        + Add API Integration
      </Button>
    </div>
  )

  const renderBillingTab = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Current Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Tokens Used</span>
                <span className="text-white">
                  {user.usage.tokens_used.toLocaleString()}/{user.usage.tokens_limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full"
                  style={{ width: `${(user.usage.tokens_used / user.usage.tokens_limit) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">API Calls</span>
                <span className="text-white">
                  {user.usage.api_calls.toLocaleString()}/{user.usage.api_limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${(user.usage.api_calls / user.usage.api_limit) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">{user.plan} Plan</h4>
              <p className="text-slate-400 text-sm">Unlimited models and integrations</p>
            </div>
            <Button variant="outline" className="border-slate-600 text-white">
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-4xl h-[80vh] flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-700 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600/50 to-blue-700/50 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          <ScrollArea className="h-full">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'models' && renderModelsTab()}
            {activeTab === 'mcp' && renderMCPTab()}
            {activeTab === 'api' && renderAPITab()}
            {activeTab === 'billing' && renderBillingTab()}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal