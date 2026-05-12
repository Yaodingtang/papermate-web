'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Highlighter, Bookmark, PenTool, MessageSquare, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MoreHorizontal, Send, Sparkles, FileText, Quote, Hash, Lightbulb, BookOpen, ExternalLink } from 'lucide-react'

const mockPaper = {
  id: 1,
  title: 'Attention Is All You Need',
  authors: 'Vaswani, Shazeer, Parmar et al.',
  year: 2017,
  venue: 'NeurIPS 2017',
}

export default function ReadingPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showAI, setShowAI] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/bookshelf" className="p-2 hover:bg-gray-100 rounded-xl">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-gray-900 truncate">{mockPaper.title}</h1>
            <p className="text-xs text-gray-500">{mockPaper.authors}</p>
          </div>
          <Link 
            href={`/reading/${mockPaper.id}/chat`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-700"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI问答
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-xl">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="高亮">
              <Highlighter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="批注">
              <PenTool className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="书签">
              <Bookmark className="w-5 h-5" />
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="引用">
              <Quote className="w-5 h-5" />
            </button>
            <Link href={`/reading/${mockPaper.id}/citation`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="导出引用">
              <Hash className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 bg-gray-100 rounded-xl hover:bg-gray-200">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">{currentPage} / 15</span>
            <button className="p-1.5 bg-gray-100 rounded-xl hover:bg-gray-200">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="缩小">
              <ZoomOut className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" title="放大">
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-hidden flex">
        {/* PDF 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Attention Is All You Need</h2>
            <p className="text-sm text-gray-500 mb-6">{mockPaper.authors} · {mockPaper.venue}</p>
            
            {/* AI 快捷操作 */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-xl">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">AI 助手已就绪</span>
              <Link href={`/reading/${mockPaper.id}/chat`} className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-lg">
                开始对话
              </Link>
            </div>
            
            <h3 className="text-base font-semibold text-gray-800 mb-3">Abstract</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mb-3">1 Introduction</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mb-3">2 Background</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building block, computing hidden representations in parallel for all input and output positions.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mb-3">3 Model Architecture</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations (x₁, ..., xₙ) to a sequence of continuous representations z = (z₁, ..., zₙ).
            </p>

            {/* 图表占位 */}
            <div className="my-6 p-8 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <p className="text-sm text-gray-500">[ Figure 1: The Transformer Architecture ]</p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              The Transformer uses multi-head self-attention to allow the model to jointly attend to information from different representation subspaces at different positions.
            </p>

            <div className="h-32" />
          </div>
        </div>

        {/* 右侧快捷面板 */}
        <div className="w-64 bg-white border-l border-gray-100 p-4 hidden lg:block">
          <h3 className="text-sm font-medium text-gray-900 mb-3">快捷操作</h3>
          
          <div className="space-y-2">
            <Link
              href={`/reading/${mockPaper.id}/chat`}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">AI 问答</p>
                <p className="text-xs text-gray-500">和 AI 讨论这篇论文</p>
              </div>
            </Link>

            <Link
              href={`/reading/${mockPaper.id}/citation`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              <Quote className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">导出引用</p>
                <p className="text-xs text-gray-500">BibTeX, APA 等</p>
              </div>
            </Link>

            <Link
              href={`/reading/${mockPaper.id}/discussion`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">团队讨论</p>
                <p className="text-xs text-gray-500">与团队成员交流</p>
              </div>
            </Link>
          </div>

          <h3 className="text-sm font-medium text-gray-900 mt-6 mb-3">AI 推荐问题</h3>
          <div className="space-y-2">
            {[
              '这篇论文的核心贡献是什么？',
              'Transformer 的优势是什么？',
              '如何理解多头注意力？',
            ].map((q, i) => (
              <Link
                key={i}
                href={`/reading/${mockPaper.id}/chat?q=${encodeURIComponent(q)}`}
                className="block p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}