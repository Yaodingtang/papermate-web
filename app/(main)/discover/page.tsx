'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, FileText, ChevronRight, Clock, Users, TrendingUp, SlidersHorizontal } from 'lucide-react'

const mockPapers = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, venue: 'NeurIPS', citations: 89000, abstract: '我们提出了一种新的简单网络架构——Transformer...' },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, venue: 'NAACL', citations: 75000, abstract: '我们引入了一种新的语言表示模型...' },
  { id: 3, title: 'GPT-4 Technical Report', authors: 'OpenAI', year: 2023, venue: 'arXiv', citations: 4500, abstract: '我们报告了GPT-4的开发...' },
  { id: 4, title: 'LoRA: Low-Rank Adaptation', authors: 'Hu et al.', year: 2021, venue: 'ICLR', citations: 12000, abstract: '我们提出了低秩自适应...' },
]

const categories = ['全部', 'NLP', 'CV', 'ML', 'RL', 'KG']

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">发现论文</h1>
          
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索论文、关键词、作者..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-6 py-4 overflow-x-auto bg-white border-b border-gray-100">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 论文列表 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">共 {mockPapers.length} 篇</span>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <SlidersHorizontal className="w-4 h-4" />
            筛选
          </button>
        </div>

        <div className="space-y-4">
          {mockPapers.map(paper => (
            <Link
              key={paper.id}
              href={`/discover/${paper.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
            >
              <h3 className="text-base font-medium text-gray-900 mb-2">{paper.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{paper.authors} · {paper.year} · {paper.venue}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{paper.abstract}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {paper.citations.toLocaleString()} 引用
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}