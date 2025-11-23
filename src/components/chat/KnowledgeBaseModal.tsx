'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, BookOpen, X, FileText, Upload, Trash2, Brain, Zap } from 'lucide-react'

interface KnowledgeBaseModalProps {
  knowledgeBases: any[]
  onClose: () => void
  onKnowledgeBaseSelect: (knowledgeBase: any) => void
}

const KnowledgeBaseModal = ({
  knowledgeBases,
  onClose,
  onKnowledgeBaseSelect
}: KnowledgeBaseModalProps) => {
  const [selectedKB, setSelectedKB] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [selectedKBForDocs, setSelectedKBForDocs] = useState<string | null>(null)
  const [ragTraining, setRagTraining] = useState<{[kbId: string]: boolean}>({})
  const [newKBForm, setNewKBForm] = useState({
    name: '',
    description: ''
  })
  const [kbDocuments, setKbDocuments] = useState<{[kbId: string]: Array<{
    id: string, 
    name: string, 
    size: number, 
    type: string, 
    status: 'processing' | 'completed' | 'failed', 
    chunks?: number,
    uploadedAt: string
  }>}>({})
  const [localKnowledgeBases, setLocalKnowledgeBases] = useState(knowledgeBases)
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-green-500'
      case 'processing': return 'text-yellow-500'
      case 'ready': return 'text-blue-500'
      case 'error': return 'text-red-500'
      default: return 'text-slate-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return '✅'
      case 'processing': return '⏳'
      case 'ready': return '📚'
      case 'error': return '❌'
      default: return '📄'
    }
  }

  const handleCreateNew = () => {
    setShowCreateForm(true)
  }

  const handleSubmitNewKB = () => {
    if (!newKBForm.name.trim()) return
    
    const newKB = {
      id: `kb_${Date.now()}`,
      name: newKBForm.name.trim(),
      description: newKBForm.description.trim() || 'Add your documents here',
      files: 0,
      size: '0 MB',
      status: 'ready',
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      categories: [],
      fileTypes: []
    }
    
    setLocalKnowledgeBases(prev => [...prev, newKB])
    setJustCreatedId(newKB.id)
    
    // Reset form and close
    setNewKBForm({ name: '', description: '' })
    setShowCreateForm(false)
    
    console.log('✅ Successfully created new Knowledge Base:', newKB)
    
    // Optional: Show success message (you could add a toast notification here)
    setTimeout(() => {
      console.log('💡 Tip: Click "Select" on your new knowledge base to use it, or click "+ Add Files" to upload documents.')
    }, 1000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && selectedKBForDocs) {
      Array.from(files).forEach((file) => {
        const fileData = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'processing' as const,
          chunks: Math.ceil(file.size / 1024), // Simulate chunk processing
          uploadedAt: new Date().toISOString()
        }
        
        setKbDocuments(prev => ({
          ...prev,
          [selectedKBForDocs]: [...(prev[selectedKBForDocs] || []), fileData]
        }))
        
        // Simulate processing
        setTimeout(() => {
          setKbDocuments(prev => ({
            ...prev,
            [selectedKBForDocs]: prev[selectedKBForDocs]?.map(f => 
              f.id === fileData.id ? {...f, status: 'completed'} : f
            ) || []
          }))
        }, 2000 + Math.random() * 3000)
      })
    }
  }

  const startRAGTraining = (kbId: string) => {
    setRagTraining(prev => ({...prev, [kbId]: true}))
    // Simulate RAG training process
    setTimeout(() => {
      setRagTraining(prev => ({...prev, [kbId]: false}))
    }, 5000)
  }

  const removeDocument = (kbId: string, docId: string) => {
    setKbDocuments(prev => ({
      ...prev,
      [kbId]: prev[kbId]?.filter(f => f.id !== docId) || []
    }))
  }

  const getCurrentKBDocuments = () => {
    return selectedKBForDocs ? kbDocuments[selectedKBForDocs] || [] : []
  }

  const getKBDocumentCount = (kbId: string) => {
    return kbDocuments[kbId]?.length || 0
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-2xl font-semibold">Knowledge Bases</h2>
              <p className="text-slate-400 mt-1">Manage your document collections and training data</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowDocuments(!showDocuments)}
                variant="outline"
                size="sm"
                className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Button>
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                + New Knowledge Base
              </Button>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Document Management Interface */}
              {showDocuments && (
                <div className="space-y-6">
                  {/* Knowledge Base Selector */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                        <span>Select Knowledge Base for Document Management</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {localKnowledgeBases.map((kb) => (
                          <button
                            key={kb.id}
                            onClick={() => setSelectedKBForDocs(kb.id)}
                            className={`p-4 rounded-lg border transition-all text-left ${
                              selectedKBForDocs === kb.id 
                                ? 'border-cyan-400 bg-cyan-400/10' 
                                : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-sm">{kb.name}</h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{kb.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-xs text-slate-500">
                                    {getKBDocumentCount(kb.id)} documents
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(kb.status)} bg-slate-900`}>
                                    {kb.status}
                                  </span>
                                </div>
                              </div>
                              {selectedKBForDocs === kb.id && (
                                <CheckCircle className="w-5 h-5 text-cyan-400 ml-2" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Upload Section - Only show if KB is selected */}
                  {selectedKBForDocs && (
                    <Card className="bg-slate-800 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Upload className="w-5 h-5" />
                            <span>Upload Documents to &quot;{localKnowledgeBases.find(kb => kb.id === selectedKBForDocs)?.name}&quot;</span>
                          </div>
                          <div className="text-sm text-slate-400">
                            Supported: PDF, DOCX, TXT, MD, CSV
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.docx,.txt,.md,.csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-300 mb-2">Drop files here or click to browse</p>
                            <p className="text-sm text-slate-500">Max file size: 10MB per file</p>
                          </label>
                        </div>

                        {/* Uploaded Files List */}
                        {getCurrentKBDocuments().length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-white flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>Uploaded Documents ({getCurrentKBDocuments().length})</span>
                            </h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {getCurrentKBDocuments().map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                      file.status === 'completed' ? 'bg-green-500' :
                                      file.status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                                      'bg-red-500'
                                    }`} />
                                    <div>
                                      <p className="text-white font-medium text-sm">{file.name}</p>
                                      <p className="text-slate-400 text-xs">
                                        {formatFileSize(file.size)} • {file.chunks} chunks • {file.status}
                                      </p>
                                      <p className="text-slate-500 text-xs">
                                        Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {file.status === 'completed' && (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeDocument(selectedKBForDocs!, file.id)}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* RAG Training Section */}
                        {getCurrentKBDocuments().some(f => f.status === 'completed') && (
                          <div className="border-t border-slate-600 pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-white flex items-center space-x-2">
                                  <Brain className="w-4 h-4 text-purple-400" />
                                  <span>RAG Training</span>
                                </h4>
                                <p className="text-sm text-slate-400">
                                  Process {getCurrentKBDocuments().filter(f => f.status === 'completed').length} documents for retrieval-augmented generation
                                </p>
                              </div>
                              <Button
                                onClick={() => startRAGTraining(selectedKBForDocs!)}
                                disabled={ragTraining[selectedKBForDocs!]}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                {ragTraining[selectedKBForDocs!] ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Training...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <Zap className="w-4 h-4" />
                                    <span>Start Training</span>
                                  </div>
                                )}
                              </Button>
                            </div>
                            {ragTraining[selectedKBForDocs!] && (
                              <div className="mt-3 p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                                <p className="text-purple-300 text-sm flex items-center space-x-2">
                                  <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                                  <span>Processing documents for vector embeddings and chunk optimization...</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Create New KB Form */}
              {showCreateForm && (
                <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Create New Knowledge Base</span>
                      </div>
                      <button 
                        onClick={() => setShowCreateForm(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Knowledge Base Name *
                      </label>
                      <input
                        type="text"
                        value={newKBForm.name}
                        onChange={(e) => setNewKBForm(prev => ({...prev, name: e.target.value}))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none"
                        placeholder="Enter knowledge base name..."
                        maxLength={100}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newKBForm.description}
                        onChange={(e) => setNewKBForm(prev => ({...prev, description: e.target.value}))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none h-20 resize-none"
                        placeholder="Describe what this knowledge base will contain..."
                        maxLength={500}
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="text-slate-400 border-slate-600 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitNewKB}
                        disabled={!newKBForm.name.trim()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Knowledge Base
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Knowledge Base List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localKnowledgeBases.map((kb) => (
                  <Card 
                    key={kb.id} 
                    className={`bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer ${
                      selectedKB === kb.id ? 'border-purple-500 bg-slate-800/80' : ''
                    } ${
                      justCreatedId === kb.id ? 'ring-2 ring-green-400/50 border-green-400/50 animate-pulse bg-green-900/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedKB(selectedKB === kb.id ? null : kb.id)
                      // Clear the "just created" highlight when clicked
                      if (justCreatedId === kb.id) {
                        setTimeout(() => setJustCreatedId(null), 3000)
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl">{getStatusIcon(kb.status)}</div>
                          <div>
                            <CardTitle className="text-white text-lg">{kb.name}</CardTitle>
                            <span className={`text-sm ${getStatusColor(kb.status)}`}>
                              {kb.status.charAt(0).toUpperCase() + kb.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <CardDescription className="text-slate-400">
                        {kb.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Documents:</span>
                          <span className="text-white ml-2 font-medium">{getKBDocumentCount(kb.id)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Status:</span>
                          <span className={`ml-2 font-medium ${
                            ragTraining[kb.id] ? 'text-purple-400' : 
                            getKBDocumentCount(kb.id) > 0 ? 'text-green-400' : 'text-slate-400'
                          }`}>
                            {ragTraining[kb.id] ? 'Training...' : 
                             getKBDocumentCount(kb.id) > 0 ? 'Ready' : 'Empty'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedKBForDocs(kb.id)
                            setShowDocuments(true)
                          }}
                          className="text-xs bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 hover:bg-cyan-600/30"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Add Docs
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onKnowledgeBaseSelect(kb)
                            onClose()
                          }}
                          className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex-1"
                        >
                          Select KB
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <span className="text-slate-500 text-xs">
                          Created: {new Date(kb.created).toLocaleDateString()}
                        </span>
                        {getKBDocumentCount(kb.id) > 0 && (
                          <span className="text-slate-500 text-xs">
                            {kbDocuments[kb.id]?.filter(d => d.status === 'completed').length || 0} processed
                          </span>
                        )}
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

export default KnowledgeBaseModal