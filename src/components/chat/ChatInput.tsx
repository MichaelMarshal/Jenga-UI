'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Brain, Send, Paperclip } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder: _placeholder = "Type your message..." 
}) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && !isComposing) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileUpload = () => {
    // Simulate file upload functionality
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.doc,.docx,.txt,.md,.json'
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        // In a real app, would upload files to knowledge base
        console.log('Files selected for upload:', Array.from(files).map(f => f.name))
        // Show toast notification or modal
      }
    }
    input.click()
  }

  return (
    <div className="p-4 border-t border-cyan-500/20 bg-slate-900/10 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-4">
          {/* Neural Upload */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 flex-shrink-0 mb-2 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
            title="Upload to neural database"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Neural Input Field */}
          <div className="flex-1 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur opacity-40" />
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="Neural query interface ready..."
              disabled={disabled}
              className="w-full bg-slate-800/30 border border-cyan-500/30 rounded-xl px-5 py-4 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 resize-none min-h-[48px] max-h-32 backdrop-blur-sm transition-all duration-300 shadow-lg hover:border-cyan-400/50 relative"
              rows={1}
            />
            
            {/* Neural Activity Indicator */}
            {message.length > 500 && (
              <div className="absolute -top-6 right-0 text-xs text-cyan-400 flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span>{message.length}/2000 tokens</span>
              </div>
            )}
          </div>

          {/* Quantum Send Button */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-60 animate-pulse" />
            <Button
              type="submit"
              disabled={!message.trim() || disabled || isComposing}
              className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 border border-cyan-400/50"
            >
              {disabled ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span className="font-semibold">Send</span>
                </div>
              )}
            </Button>
          </div>
        </div>
        
        {/* Neural Interface Hints */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center space-x-4 text-xs text-cyan-300/60">
            <span>Enter to transmit • Shift+Enter for multi-line</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-purple-300/60">
            <Brain className="w-3 h-3" />
            <span>/neural</span>
            <span>for advanced commands</span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChatInput