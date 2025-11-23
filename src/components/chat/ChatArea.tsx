'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Settings, BarChart3, Brain, Cog } from 'lucide-react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

interface ChatAreaProps {
  currentChat: any
  selectedModel: any
  selectedKnowledgeBase: any
  onSendMessage: (content: string) => void
  onToggleSidebar: () => void
  onModelConfig: () => void
  onShowMetrics: () => void
  isMobile: boolean
}

const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  selectedModel,
  selectedKnowledgeBase,
  onSendMessage,
  onToggleSidebar,
  onModelConfig,
  onShowMetrics,
  isMobile
}) => {
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat.messages])

  const handleSendMessage = async (content: string) => {
    setIsTyping(true)
    onSendMessage(content)
    
    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(false)
    }, 3000)
  }

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('GPT')) return '🤖'
    if (modelName.includes('Claude')) return '🧠'
    if (modelName.includes('LLaMA') || modelName.includes('Custom')) return '⚡'
    return '🤖'
  }

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden relative" style={{ height: '100vh', maxHeight: '100vh' }}>
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-slate-900/20 backdrop-blur-xl flex-shrink-0 relative z-10 shadow-lg">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="text-cyan-400 hover:text-white hover:bg-cyan-500/20"
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white text-xl">{getModelIcon(selectedModel.name)}</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-20 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{selectedModel.name}</h2>
              <p className="text-cyan-300/70 text-sm font-medium flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span>{selectedKnowledgeBase.name} • {selectedKnowledgeBase.files} neural nodes</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onModelConfig}
            className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Cog className="w-4 h-4" />
              <span>Neural Config</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowMetrics}
            className="text-purple-400 hover:text-white hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Metrics</span>
            </div>
          </Button>
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" title="AI Active" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {currentChat.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-600/20 to-blue-800/20 flex items-center justify-center">
                <span className="text-4xl">{getModelIcon(selectedModel.name)}</span>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Start a conversation
              </h3>
              <p className="text-slate-400 mb-6">
                Ask me anything about your {selectedKnowledgeBase.name}. I have access to {selectedKnowledgeBase.files} files and can help with analysis, summaries, and insights.
              </p>
              <div className="grid grid-cols-1 gap-2 text-left">
                {[
                  "💡 Analyze our latest strategy documents",
                  "📊 Summarize key performance metrics", 
                  "🔍 Find specific information in our knowledge base",
                  "📝 Create actionable recommendations"
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-slate-300 hover:text-white hover:bg-slate-800/50 h-auto p-3"
                    onClick={() => handleSendMessage(suggestion.replace(/^[^\s]+ /, ''))}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
              {currentChat.messages.map((message: any, index: number) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLatest={index === currentChat.messages.length - 1}
                  modelIcon={getModelIcon(selectedModel.name)}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">{getModelIcon(selectedModel.name)}</span>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area with Model Selector */}
      <div className="border-t border-slate-700/50 bg-slate-950/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-1.5 border-b border-slate-700/30">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs">Model:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onModelConfig}
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 h-8 px-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{getModelIcon(selectedModel.name)}</span>
                <span className="text-sm">{selectedModel.name}</span>
              </div>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${
              selectedModel.status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-slate-400 text-xs">
              {selectedModel.status === 'active' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder={`Ask ${selectedModel.name} about ${selectedKnowledgeBase.name}...`}
        />
      </div>
    </div>
  )
}

export default ChatArea