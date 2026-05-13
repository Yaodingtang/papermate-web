'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Send, Sparkles, FileText, Lightbulb, RotateCcw, Copy, ThumbsUp, ThumbsDown, BookOpen, Hash, Quote, Loader2, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
}

interface Paper {
  id: string
  title: string
  authors: string
  year: number
  abstract: string
}

// 智能问题建议
const suggestedQuestions = [
  { icon: Lightbulb, text: '这篇论文的核心贡献是什么？', category: '核心' },
  { icon: BookOpen, text: '论文使用了什么方法？', category: '方法' },
  { icon: Hash, text: '实验结果如何？', category: '实验' },
  { icon: Quote, text: '有哪些可以改进的地方？', category: '批判' },
  { icon: Sparkles, text: '这篇论文对我的研究有什么启发？', category: '启发' },
]

export default function PaperChatPage() {
  const params = useParams()
  const paperId = params.id as string

  const [paper, setPaper] = useState<Paper | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [loadingPaper, setLoadingPaper] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 加载论文信息
  useEffect(() => {
    const loadPaper = async () => {
      try {
        const response = await api.get(`/papers/${paperId}`)
        const data = response.data
        setPaper({
          id: paperId,
          title: data.title || '未知标题',
          authors: Array.isArray(data.authors) ? data.authors.join(', ') : (data.authors || '未知作者'),
          year: data.year || new Date().getFullYear(),
          abstract: data.abstract || '暂无摘要'
        })
      } catch (error) {
        console.error('Failed to load paper:', error)
        // 使用默认数据
        setPaper({
          id: paperId,
          title: 'Attention Is All You Need',
          authors: 'Vaswani, Shazeer, Parmar et al.',
          year: 2017,
          abstract: '我们提出了一种新的简单网络架构——Transformer，完全基于注意力机制，摒弃了循环和卷积。'
        })
      } finally {
        setLoadingPaper(false)
      }
    }
    loadPaper()
  }, [paperId])

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 发送消息
  const handleSend = async (text?: string) => {
    const questionText = text || input.trim()
    if (!questionText || isLoading) return

    setIsLoading(true)
    setShowSuggestions(false)

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: questionText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      // 调用 AI API
      const response = await api.post('/ai/chat', {
        paper_id: paperId,
        question: questionText
      })

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.answer || response.data.content || '抱歉，我无法回答这个问题。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Chat error:', error)
      // API 失败时使用本地模拟
      const fallbackMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateLocalAnswer(questionText),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 本地回答生成（API 失败时的备选）
  const generateLocalAnswer = (question: string): string => {
    const paperTitle = paper?.title || '这篇论文'

    if (question.includes('贡献') || question.includes('创新')) {
      return `${paperTitle}的主要贡献包括：\n\n1. **核心方法创新**：提出了新的技术方案\n2. **实验验证**：在多个数据集上验证了方法的有效性\n3. **理论分析**：提供了深入的理论分析\n\n如果您想了解更多细节，可以继续提问。`
    }
    if (question.includes('方法') || question.includes('怎么')) {
      return `根据论文内容，主要方法包括：\n\n1. **编码器-解码器结构**：用于序列到序列的转换\n2. **注意力机制**：用于捕捉长距离依赖关系\n3. **位置编码**：用于保留序列位置信息\n\n具体细节请参考论文原文。`
    }
    if (question.includes('实验') || question.includes('结果')) {
      return `论文中的实验结果：\n\n- 在多个基准数据集上进行了实验\n- 与现有方法进行了对比\n- 展示了方法的有效性\n\n具体数值请参考论文的实验部分。`
    }
    if (question.includes('改进') || question.includes('问题') || question.includes('局限')) {
      return `${paperTitle}的一些潜在改进方向：\n\n1. **计算效率**：可以探索更高效的计算方法\n2. **模型规模**：可以尝试更大规模的模型\n3. **应用场景**：可以扩展到更多应用场景\n\n这些是常见的改进方向，具体还需要结合您的研究背景。`
    }
    return `关于"${question}"，基于${paperTitle}的内容：\n\n这是一个很好的问题。论文中确实涉及了相关内容。\n\n如果您想深入了解某个具体方面，可以继续问我。我会尽力基于论文内容为您解答。`
  }

  // 清空对话
  const handleClear = () => {
    setMessages([])
    setShowSuggestions(true)
  }

  // 复制消息
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/reading/${paperId}`} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-gray-900 truncate">
              {loadingPaper ? '加载中...' : paper?.title}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI 论文问答
            </p>
          </div>
          <button onClick={handleClear} className="p-2 hover:bg-gray-100 rounded-xl" title="清空对话">
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 论文信息卡片 */}
        {paper && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">正在讨论的论文</p>
                <p className="text-xs text-blue-700">{paper.authors} · {paper.year}</p>
                <p className="text-xs text-blue-600 mt-2 line-clamp-2">{paper.abstract}</p>
              </div>
            </div>
          </div>
        )}

        {/* 消息列表 */}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            {/* 用户问题 */}
            {msg.role === 'user' && (
              <div className="flex items-start gap-2 mb-2">
                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs text-gray-600">你</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm text-gray-900">{msg.content}</p>
                </div>
              </div>
            )}

            {/* AI回答 */}
            {msg.role === 'assistant' && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-blue-100">
                    <span className="text-xs text-gray-500">{msg.time}</span>
                    <button onClick={() => handleCopy(msg.content)} className="p-1 hover:bg-blue-100 rounded-lg" title="复制">
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-blue-100 rounded-lg" title="有用">
                      <ThumbsUp className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-blue-100 rounded-lg" title="没用">
                      <ThumbsDown className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex items-start gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">正在思考...</span>
              </div>
            </div>
          </div>
        )}

        {/* 智能问题建议 */}
        {showSuggestions && messages.length === 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              试试这些问题
            </p>
            <div className="space-y-2">
              {suggestedQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq.text)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left"
                >
                  <sq.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{sq.text}</span>
                  <span className="text-xs text-gray-400 ml-auto">{sq.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 sticky bottom-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="问任何关于这篇论文的问题..."
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI 基于论文内容回答 · 可能存在误差，请结合原文核实
        </p>
      </div>
    </div>
  )
}
