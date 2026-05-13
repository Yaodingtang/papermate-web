'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Sparkles, FileText, MessageCircle, Lightbulb, RotateCcw, Copy, ThumbsUp, ThumbsDown, ChevronDown, BookOpen, Hash, Quote } from 'lucide-react'

// 模拟论文数据
const mockPaper = {
  id: 1,
  title: 'Attention Is All You Need',
  authors: 'Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin',
  year: 2017,
  abstract: '我们提出了一种新的简单网络架构——Transformer，完全基于注意力机制，摒弃了循环和卷积。Transformer在两个机器翻译任务上的实验表明，这些模型在质量上更优越，同时更具并行性，训练时间显著减少...',
}

// 模拟AI对话
const mockConversations: Record<number, Array<{id: number; question: string; answer: string; time: string}>> = {
  1: [
    { id: 1, question: '这篇论文的核心贡献是什么？', answer: '这篇论文的核心贡献是提出了**Transformer架构**，这是第一个完全基于注意力机制的序列转换模型。主要创新点包括：\n\n1. **自注意力机制**：允许模型在处理序列时直接关注任意位置的信息\n2. **多头注意力**：让模型同时从多个角度理解输入\n3. **位置编码**：用位置向量替代传统的序列处理\n\n这个架构彻底改变了NLP领域，成为后来BERT、GPT等模型的基础。', time: '10:30' },
    { id: 2, question: 'Transformer和RNN相比有什么优势？', answer: 'Transformer相比RNN有几个关键优势：\n\n**并行计算**\n- RNN必须按顺序处理，无法并行\n- Transformer可以同时处理所有位置，训练速度快很多\n\n**长距离依赖**\n- RNN处理长序列时信息会逐渐丢失\n- Transformer的自注意力可以直接连接任意两个位置\n\n**梯度问题**\n- RNN容易出现梯度消失/爆炸\n- Transformer没有这个问题，训练更稳定\n\n论文中的实验显示，Transformer在WMT翻译任务上达到了28.4 BLEU，比之前的最佳结果提高了2个点以上。', time: '10:35' },
    { id: 3, question: '多头注意力是怎么工作的？', answer: '多头注意力是Transformer的关键创新之一。\n\n**原理**：\n将输入向量投影到多个不同的子空间，每个"头"独立计算注意力，最后合并结果。\n\n**公式**：\n```\nMultiHead(Q,K,V) = Concat(head1,...,headh)W^O\n其中 headi = Attention(QW_i^Q, KW_i^K, VW_i^V)\n```\n\n**为什么有效**：\n- 每个头可以关注不同的信息类型\n- 比如一个头关注语法关系，另一个头关注语义关系\n- 论文使用了8个头，维度512，每个头64维\n\n这让模型能从多个角度"理解"输入，比单一注意力更强大。', time: '10:42' },
  ],
}

// 智能问题建议
const suggestedQuestions = [
  { icon: Lightbulb, text: '这篇论文的核心贡献是什么？', category: '核心' },
  { icon: BookOpen, text: '论文使用了什么方法？', category: '方法' },
  { icon: Hash, text: '实验结果如何？', category: '实验' },
  { icon: Quote, text: '有哪些可以改进的地方？', category: '批判' },
  { icon: Sparkles, text: '这篇论文对我的研究有什么启发？', category: '启发' },
]

export default function PaperChatPage({ params }: { params: { id: string } }) {
  const paperId = parseInt(params.id)
  const paper = mockPaper
  const conversations = mockConversations[paperId] || []
  
  const [messages, setMessages] = useState(conversations)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const questionText = text || input.trim()
    if (!questionText) return

    setIsLoading(true)
    setShowSuggestions(false)
    
    // 模拟AI响应
    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        question: questionText,
        answer: generateMockAnswer(questionText),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInput('')
      setIsLoading(false)
    }, 1500)
  }

  const generateMockAnswer = (question: string) => {
    // 根据问题类型返回不同回答
    if (question.includes('方法') || question.includes('怎么')) {
      return '根据论文内容，主要方法包括：\n\n1. **编码器-解码器结构**：各6层，每层包含自注意力和前馈网络\n2. **注意力机制**：使用Scaled Dot-Product Attention\n3. **位置编码**：使用正弦/余弦函数生成位置向量\n\n具体公式见论文第3节，代码实现可参考官方开源版本。'
    }
    if (question.includes('实验') || question.includes('结果')) {
      return '论文在两个翻译任务上进行了实验：\n\n**WMT 2014 English-to-German**\n- BLEU: 28.4（新纪录）\n- 训练时间：3.5天（8 GPU）\n\n**WMT 2014 English-to-French**\n- BLEU: 41.8\n\n相比之前的最佳模型，质量提升的同时训练时间大幅缩短。'
    }
    if (question.includes('改进') || question.includes('问题')) {
      return '论文的一些潜在改进方向：\n\n1. **计算复杂度**：自注意力对长序列计算量大，可以探索稀疏注意力\n2. **位置编码**：可尝试学习式位置编码而非固定公式\n3. **模型规模**：论文只用6层，可以探索更深更大的模型\n\n后来的研究（如Sparse Transformer、Longformer）确实在这些方向有所突破。'
    }
    return '这是一个很好的问题！基于论文内容，我的理解是...\n\nTransformer的核心思想是用注意力替代传统的序列处理。这让模型能直接"看到"整个序列，而不需要逐步传递信息。\n\n如果你想深入了解某个具体方面，可以继续问我。'
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
            <h1 className="text-sm font-medium text-gray-900 truncate">{paper.title}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI 论文问答
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-xl" title="清空对话">
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 论文信息卡片 */}
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

        {/* 消息列表 */}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            {/* 用户问题 */}
            <div className="flex items-start gap-2 mb-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs text-gray-600">你</span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 px-4 py-2.5 max-w-[85%]">
                <p className="text-sm text-gray-900">{msg.question}</p>
              </div>
            </div>
            
            {/* AI回答 */}
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {msg.answer}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-blue-100">
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  <button className="p-1 hover:bg-blue-100 rounded-lg" title="复制">
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
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" />
                <span className="text-sm text-gray-500 ml-1">正在思考...</span>
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
              className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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