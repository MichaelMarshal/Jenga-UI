'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Save, X, Eye, EyeOff, Settings } from 'lucide-react'

interface ModelConfigModalProps {
  aiModels: any[]
  onClose: () => void
  onModelSelect: (model: any) => void
}

const ModelConfigModal: React.FC<ModelConfigModalProps> = ({
  aiModels,
  onClose,
  onModelSelect
}) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [editingModel, setEditingModel] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<any>({})
  const [customModel, setCustomModel] = useState({
    name: '',
    provider: '',
    endpoint: '',
    api_key: '',
    max_tokens: 4096,
    temperature: 0.7
  })

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('GPT')) return '🤖'
    if (modelName.includes('Claude')) return '🧠'
    if (modelName.includes('LLaMA') || modelName.includes('Custom')) return '⚡'
    if (modelName.includes('Gemini')) return '🔶'
    return '🤖'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'connected': return 'bg-blue-500'
      case 'inactive': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai': return 'from-green-600 to-blue-600'
      case 'anthropic': return 'from-orange-600 to-red-600'
      case 'self-hosted': return 'from-blue-600 to-blue-700'
      case 'google': return 'from-blue-600 to-cyan-600'
      default: return 'from-gray-600 to-slate-600'
    }
  }

  const handleAddCustomModel = () => {
    const newModel = {
      id: `model_${Date.now()}`,
      name: customModel.name,
      provider: customModel.provider,
      type: 'custom',
      status: 'inactive',
      config: {
        endpoint: customModel.endpoint,
        api_key: customModel.api_key,
        max_tokens: customModel.max_tokens,
        temperature: customModel.temperature
      },
      usage: {
        requests_today: 0,
        tokens_today: 0
      }
    }
    
    // In real app, would add to models list
    console.log('Added custom model:', newModel)
    setShowAddCustom(false)
    setCustomModel({
      name: '',
      provider: '',
      endpoint: '',
      api_key: '',
      max_tokens: 4096,
      temperature: 0.7
    })
  }

  const testConnection = async (model: any) => {
    // Simulate API test
    console.log('Testing connection for:', model.name)
    // In real app, would make test API call
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-5xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-white text-2xl font-semibold">AI Models Configuration</h2>
            <p className="text-slate-400 mt-1">Manage and configure your AI models</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              + Add Custom Model
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              
              {/* Add Custom Model Form */}
              {showAddCustom && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Add Custom Model</CardTitle>
                    <CardDescription>Configure your own AI model endpoint</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Model Name</label>
                        <input 
                          type="text" 
                          value={customModel.name}
                          onChange={(e) => setCustomModel({...customModel, name: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                          placeholder="My Custom Model"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Provider</label>
                        <input 
                          type="text" 
                          value={customModel.provider}
                          onChange={(e) => setCustomModel({...customModel, provider: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                          placeholder="Custom Provider"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">API Endpoint</label>
                      <input 
                        type="url" 
                        value={customModel.endpoint}
                        onChange={(e) => setCustomModel({...customModel, endpoint: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="https://api.example.com/v1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">API Key</label>
                      <input 
                        type="password" 
                        value={customModel.api_key}
                        onChange={(e) => setCustomModel({...customModel, api_key: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Enter your API key"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Max Tokens</label>
                        <input 
                          type="number" 
                          value={customModel.max_tokens}
                          onChange={(e) => setCustomModel({...customModel, max_tokens: parseInt(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Temperature</label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="2"
                          value={customModel.temperature}
                          onChange={(e) => setCustomModel({...customModel, temperature: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 pt-4">
                      <Button
                        onClick={handleAddCustomModel}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        disabled={!customModel.name || !customModel.endpoint || !customModel.api_key}
                      >
                        Add Model
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddCustom(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Model List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiModels.map((model) => (
                  <Card 
                    key={model.id}
                    className={`bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer ${
                      selectedModel === model.id ? 'border-blue-500 bg-gradient-to-r from-blue-900/50 to-blue-800/50 ring-2 ring-blue-500/50' : ''
                    }`}
                    onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getProviderColor(model.provider)} flex items-center justify-center`}>
                            <span className="text-white text-lg">{getModelIcon(model.name)}</span>
                          </div>
                          <div>
                            <CardTitle className="text-white">{model.name}</CardTitle>
                            <p className="text-slate-400 text-sm">{model.provider} • {model.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`} />
                          <span className="text-slate-400 text-xs">{model.status}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {editingModel === model.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-slate-300 text-sm block mb-1">API Key</label>
                              <div className="relative">
                                <input
                                  type={showApiKey[model.id] ? "text" : "password"}
                                  value={formData[model.id]?.api_key || model.config?.api_key || ''}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    [model.id]: { ...formData[model.id], api_key: e.target.value }
                                  })}
                                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm pr-10"
                                  placeholder="Enter API key"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-8 w-8 p-0"
                                  onClick={() => setShowApiKey({ ...showApiKey, [model.id]: !showApiKey[model.id] })}
                                >
                                  {showApiKey[model.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <label className="text-slate-300 text-sm block mb-1">Endpoint</label>
                              <input
                                type="text"
                                value={formData[model.id]?.endpoint || model.config?.endpoint || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  [model.id]: { ...formData[model.id], endpoint: e.target.value }
                                })}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                                placeholder="API endpoint URL"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-slate-300 text-sm block mb-1">Max Tokens</label>
                              <input
                                type="number"
                                value={formData[model.id]?.max_tokens || model.config?.max_tokens || 4096}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  [model.id]: { ...formData[model.id], max_tokens: parseInt(e.target.value) }
                                })}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-slate-300 text-sm block mb-1">Temperature</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="2"
                                value={formData[model.id]?.temperature || model.config?.temperature || 0.7}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  [model.id]: { ...formData[model.id], temperature: parseFloat(e.target.value) }
                                })}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingModel(null)}
                              className="text-slate-400 hover:text-white"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                console.log('Saving model config:', formData[model.id])
                                setEditingModel(null)
                              }}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Requests Today:</span>
                              <span className="text-white ml-2 font-medium">{model.usage.requests_today}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Tokens Used:</span>
                              <span className="text-white ml-2 font-medium">{model.usage.tokens_today.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-slate-500 space-y-1">
                            <div>Max Tokens: {model.config?.max_tokens?.toLocaleString() || 'N/A'}</div>
                            <div>Temperature: {model.config?.temperature || 'N/A'}</div>
                            {model.config?.endpoint && (
                              <div className="truncate">Endpoint: {model.config.endpoint}</div>
                            )}
                            <div className="truncate">API Key: {model.config?.api_key ? `${model.config.api_key.substring(0, 8)}***` : 'Not configured'}</div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              testConnection(model)
                            }}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            <div className="flex items-center space-x-1">
                              <span>🔍</span>
                              <span>Test</span>
                            </div>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingModel(model.id)
                            }}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            <div className="flex items-center space-x-1">
                              <Settings className="w-3 h-3" />
                              <span>Configure</span>
                            </div>
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onModelSelect(model)
                            onClose()
                          }}
                          className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        >
                          Select Model
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default ModelConfigModal