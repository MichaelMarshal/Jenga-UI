'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, Database, Zap, Diamond, Settings } from 'lucide-react'
import mockData from '../../data/mockData.json'

interface ChatSidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  chatSessions: any[]
  currentChatId: string
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onSettings: () => void
  onKnowledgeBase: () => void
  onModelConfig: () => void
  onAPIConfig: () => void
  user: any
  selectedModel: any
  selectedKnowledgeBase: any
  isMobile: boolean
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  collapsed,
  onCollapse,
  chatSessions: _chatSessions,
  currentChatId,
  onChatSelect,
  onNewChat,
  onSettings,
  onKnowledgeBase,
  onModelConfig,
  onAPIConfig,
  user,
  selectedModel: _selectedModel,
  selectedKnowledgeBase,
  isMobile
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('GPT')) return '🤖'
    if (modelName.includes('Claude')) return '🧠'
    if (modelName.includes('LLaMA') || modelName.includes('Custom')) return '⚡'
    return '🤖'
  }

  if (isMobile && collapsed) {
    return null
  }

  return (
    <div className={`bg-slate-950/20 backdrop-blur-2xl border-r border-cyan-500/20 transition-all duration-500 h-full max-h-full overflow-hidden shadow-2xl shadow-cyan-500/10 ${
      collapsed && !isMobile ? 'w-16' : 'w-80'
    } ${isMobile ? 'absolute inset-y-0 left-0 z-50 w-80' : ''}`} style={{ height: '100vh', maxHeight: '100vh', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(30, 41, 59, 0.2) 50%, rgba(15, 23, 42, 0.3) 100%)' }}>
      
      {/* Header */}
      <div className="p-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                  <Diamond className="w-5 h-5 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-30 animate-pulse" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">JENGA AI</h1>
                <p className="text-cyan-300/70 text-xs font-medium">{user.plan} • Neural Network</p>
              </div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCollapse(!collapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {collapsed && !isMobile ? '→' : '←'}
          </Button>
        </div>

        {(!collapsed || isMobile) && (
          <div className="mt-4">
            <Button 
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
            >
              <span className="mr-2">+</span>
              New Chat
            </Button>
          </div>
        )}
      </div>

      {/* Knowledge Base Selection */}
      {(!collapsed || isMobile) && (
        <div className="p-3 border-b border-slate-800/50 space-y-2">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-cyan-300/80 text-xs uppercase tracking-widest font-semibold flex items-center space-x-2">
                <Brain className="w-3 h-3" />
                <span>Neural Database</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('Creating new knowledge base...');
                  onKnowledgeBase();
                }}
                className="text-xs text-cyan-400 hover:text-white hover:bg-cyan-500/20 h-7 px-3 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 flex items-center space-x-1"
              >
                <Zap className="w-3 h-3" />
                <span>Create</span>
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                console.log('Opening knowledge base modal...');
                onKnowledgeBase();
              }}
              className="w-full justify-between bg-gradient-to-r from-slate-800/30 to-slate-700/30 border-cyan-500/30 text-white hover:bg-gradient-to-r hover:from-cyan-900/30 hover:to-blue-900/30 hover:border-cyan-400/50 cursor-pointer backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="truncate">{selectedKnowledgeBase.name}</span>
              </div>
              <span className="text-xs text-slate-400">{selectedKnowledgeBase.files} files</span>
            </Button>
          </div>
        </div>
      )}

      {/* Chat History */}
      {(!collapsed || isMobile) && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-3">
              Recent Chats
            </h3>
          </div>
          
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="px-3 pb-3 space-y-2">
              {mockData.recentChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`p-3 cursor-pointer transition-all duration-500 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-purple-900/20 border backdrop-blur-sm ${
                    chat.id === currentChatId 
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20' 
                      : 'bg-slate-800/10 border-slate-700/30 hover:border-cyan-500/40'
                  }`}
                  onClick={() => onChatSelect(chat.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {chat.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        {getModelIcon(chat.model)} {chat.model} • {chat.messageCount} messages
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-500 text-xs">
                          {formatDate(chat.lastMessage)}
                        </span>
                        {chat.isBookmarked && (
                          <span className="text-yellow-400 text-xs">⭐</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* User Profile & Settings */}
      {(!collapsed || isMobile) && (
        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Token Usage</span>
              <span className="text-white">
                {user.usage.tokens_used.toLocaleString()}/{user.usage.tokens_limit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-700 h-1 rounded-full"
                style={{ width: `${(user.usage.tokens_used / user.usage.tokens_limit) * 100}%` }}
              />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="w-full mt-3 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings & Integrations
          </Button>
        </div>
      )}
      
      {/* Collapsed state */}
      {collapsed && !isMobile && (
        <div className="flex flex-col items-center py-4 space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            +
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onModelConfig}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            title="Model Configuration"
          >
            <Brain className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onKnowledgeBase}
            className="text-cyan-400 hover:text-white hover:bg-cyan-500/20"
            title="Knowledge Base"
          >
            <Database className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAPIConfig}
            className="text-purple-400 hover:text-white hover:bg-purple-500/20"
            title="API Configuration"
          >
            <Zap className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ChatSidebar