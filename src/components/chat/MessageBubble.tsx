'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ThumbsUp, ThumbsDown, Diamond } from 'lucide-react'

interface MessageBubbleProps {
  message: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    sources?: Array<{
      file: string
      page?: number
      section?: string
      relevance: number
    }>
  }
  isLatest: boolean
  modelIcon: string
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLatest: _isLatest, modelIcon }) => {
  const [showSources, setShowSources] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <div key={index} className="font-semibold text-white mb-2">{line.slice(2, -2)}</div>
        }
        if (line.startsWith('# ')) {
          return <h3 key={index} className="font-bold text-lg text-white mb-2">{line.slice(2)}</h3>
        }
        if (line.startsWith('- ')) {
          return <div key={index} className="ml-4 mb-1">• {line.slice(2)}</div>
        }
        if (line.match(/^\d+\./)) {
          return <div key={index} className="ml-4 mb-1">{line}</div>
        }
        if (line.trim() === '') {
          return <br key={index} />
        }
        return <div key={index} className="mb-1">{line}</div>
      })
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-6">
        <div className="flex items-end space-x-3 max-w-[80%]">
          <div className="text-cyan-300/60 text-xs self-end mb-1">
            {formatTime(message.timestamp)}
          </div>
          <div className="bg-gradient-to-r from-cyan-500/90 to-blue-600/90 rounded-2xl rounded-br-md px-5 py-4 shadow-lg shadow-cyan-500/30 border border-cyan-400/30 backdrop-blur-sm relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-40" />
            <p className="text-white font-medium relative">{message.content}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
            <Diamond className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-4 mb-6">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur opacity-40 animate-pulse" />
        <span className="text-white text-lg relative">{modelIcon}</span>
      </div>
      
      <div className="flex-1 max-w-[80%]">
        <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm rounded-2xl rounded-tl-md px-5 py-4 border border-purple-500/20 shadow-lg shadow-purple-500/10 hover:border-purple-400/40 transition-all duration-300 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur opacity-30" />
          <div className="text-slate-200 leading-relaxed relative">
            {formatContent(message.content)}
          </div>
        </div>
        
        {/* Message Actions */}
        <div className="flex items-center space-x-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content)}
            className="text-xs text-slate-500 hover:text-slate-300 h-6 px-2"
          >
            {copied ? (
              <div className="flex items-center space-x-1">
                <span className="text-green-400">✓</span>
                <span>Copied</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </div>
            )}
          </Button>
          
          {message.sources && message.sources.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSources(!showSources)}
              className="text-xs text-slate-500 hover:text-slate-300 h-6 px-2"
            >
              <div className="flex items-center space-x-1">
                <span className="text-blue-400">📚</span>
                <span>Sources ({message.sources.length})</span>
              </div>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-500 hover:text-slate-300 h-6 px-2"
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-500 hover:text-slate-300 h-6 px-2"
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
          
          <span className="text-slate-500 text-xs ml-auto">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        {/* Sources Panel */}
        {showSources && message.sources && (
          <Card className="mt-3 bg-slate-800/30 border-slate-700/50">
            <div className="p-3">
              <h4 className="text-white text-sm font-medium mb-2">Sources</h4>
              <div className="space-y-2">
                {message.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">📄</span>
                      <span className="text-slate-300">{source.file}</span>
                      {source.page && (
                        <span className="text-slate-500">• Page {source.page}</span>
                      )}
                      {source.section && (
                        <span className="text-slate-500">• {source.section}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-slate-700 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-700 h-1 rounded-full"
          style={{ width: `${source.relevance * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400 w-8 text-right">
                        {Math.round(source.relevance * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default MessageBubble