'use client'

import React, { useState, useEffect } from 'react'
import ChatSidebar from './ChatSidebar'
import ChatArea from './ChatArea'
import SettingsModal from './SettingsModal'
import KnowledgeBaseModal from './KnowledgeBaseModal'
import ModelConfigModal from './ModelConfigModal'
import MetricsModal from './MetricsModal'
import APIConfigModal from './APIConfigModal'
import mockData from '../../data/mockData.json'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: {
    file: string
    page: number
    relevance: number
  }[]
}

interface CurrentChat {
  id: string
  messages: Message[]
}

const AIChat: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentChat, setCurrentChat] = useState<CurrentChat>({
    id: mockData.currentChat.id,
    messages: mockData.currentChat.messages as Message[]
  })
  const [chatSessions, setChatSessions] = useState(mockData.recentChats)
  const [selectedModel, setSelectedModel] = useState(mockData.aiModels[0])
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState(mockData.knowledgeBases[0])
  
  // Modals state
  const [showSettings, setShowSettings] = useState(false)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [showModelConfig, setShowModelConfig] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showAPIConfig, setShowAPIConfig] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      title: 'New Conversation',
      model: selectedModel.name,
      knowledgeBase: selectedKnowledgeBase.name,
      created: new Date().toISOString(),
      lastMessage: new Date().toISOString(),
      messageCount: 0,
      isBookmarked: false
    }
    
    setChatSessions([newChat, ...chatSessions])
    setCurrentChat({
      id: newChat.id,
      messages: []
    })
  }

  const handleKnowledgeBaseModal = () => {
    console.log('Opening knowledge base modal...')
    setShowKnowledgeBase(true)
  }

  const handleSendMessage = (content: string) => {
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date().toISOString()
    }

    const newMessages = [...currentChat.messages, userMessage]
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant' as const,
        content: getSimulatedResponse(content),
        timestamp: new Date().toISOString(),
        sources: [
          {
            file: selectedKnowledgeBase.name + '.pdf',
            page: Math.floor(Math.random() * 10) + 1,
            relevance: 0.8 + Math.random() * 0.2
          }
        ]
      }
      
      setCurrentChat({
        ...currentChat,
        messages: [...newMessages, aiResponse]
      })
    }, 1000 + Math.random() * 2000)

    setCurrentChat({
      ...currentChat,
      messages: newMessages
    })
  }

  const getSimulatedResponse = (_userContent: string): string => {
    const responses = [
      `Based on your ${selectedKnowledgeBase.name}, I can help you with that. Here's what I found:

• Key insight from your documents
• Relevant information analysis
• Actionable recommendations

Would you like me to elaborate on any specific aspect?`,
      `Great question! According to the information in your knowledge base:

**Main Points:**
1. Primary consideration from your docs
2. Supporting evidence and data
3. Best practices recommendation

I can dive deeper into any of these areas if needed.`,
      `I've analyzed your ${selectedKnowledgeBase.name} and here's what I can tell you:

**Summary:**
- Key finding from document analysis
- Relevant contextual information
- Strategic recommendations

**Next Steps:**
- Suggested action items
- Areas for further exploration

How would you like to proceed?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="chat-container flex h-screen min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20 relative" style={{ height: '100vh', maxHeight: '100vh' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-2xl animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-3/4 left-1/6 w-72 h-72 bg-gradient-to-r from-cyan-600/8 to-blue-600/8 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
      
      {/* Sidebar */}
      <ChatSidebar 
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        chatSessions={mockData.recentChats}
        currentChatId={currentChat.id}
        onChatSelect={(chatId: string) => {
          // Load specific chat messages
          const chatData = mockData.chatSessions[chatId as keyof typeof mockData.chatSessions]
          if (chatData && chatData.messages) {
            setCurrentChat({ id: chatId, messages: chatData.messages as Message[] })
          }
        }}
        onNewChat={handleNewChat}
        onSettings={() => setShowSettings(true)}
        onKnowledgeBase={handleKnowledgeBaseModal}
        onModelConfig={() => setShowModelConfig(true)}
        onAPIConfig={() => setShowAPIConfig(true)}
        user={mockData.user}
        selectedModel={selectedModel}
        selectedKnowledgeBase={selectedKnowledgeBase}
        isMobile={isMobile}
      />

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-0 h-full ${
        isMobile && !sidebarCollapsed ? 'hidden' : 'block'
      }`} style={{ height: '100vh', maxHeight: '100vh' }}>
        <ChatArea
          currentChat={currentChat}
          selectedModel={selectedModel}
          selectedKnowledgeBase={selectedKnowledgeBase}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onModelConfig={() => setShowModelConfig(true)}
          onShowMetrics={() => setShowMetrics(true)}
          isMobile={isMobile}
        />
      </div>

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          user={mockData.user}
          aiModels={mockData.aiModels}
          mcpConnections={mockData.mcpConnections}
          apiIntegrations={mockData.apiIntegrations}
          onClose={() => setShowSettings(false)}
          onModelSelect={setSelectedModel}
        />
      )}

      {showKnowledgeBase && (
        <KnowledgeBaseModal
          knowledgeBases={mockData.knowledgeBases}
          onClose={() => setShowKnowledgeBase(false)}
          onKnowledgeBaseSelect={setSelectedKnowledgeBase}
        />
      )}

      {showModelConfig && (
        <ModelConfigModal
          aiModels={mockData.aiModels}
          onClose={() => setShowModelConfig(false)}
          onModelSelect={setSelectedModel}
        />
      )}

      {showMetrics && (
        <MetricsModal
          user={mockData.user}
          selectedModel={selectedModel}
          aiModels={mockData.aiModels}
          onClose={() => setShowMetrics(false)}
        />
      )}

      {showAPIConfig && (
        <APIConfigModal
          mcpConnections={mockData.mcpConnections}
          apiIntegrations={mockData.apiIntegrations}
          onClose={() => setShowAPIConfig(false)}
          onSaveConfig={(config) => {
            console.log('Saving configuration:', config)
            setShowAPIConfig(false)
          }}
        />
      )}
    </div>
  )
}

export default AIChat