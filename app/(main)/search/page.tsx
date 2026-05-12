'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronRight } from 'lucide-react'

const mockResults = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, citations: 85000 },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2019, citations: 72000 },
  { id: 3, title: 'GPT-4 Technical Report', authors: 'OpenAI', year: 2023, citations: 15000 },
  { id: 4, title: 'Large Language Models: A Survey', authors: 'Zhang et al.', year: 2023, citations: 5000 },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'citations'>('relevance')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-3">搜索</h1>
          
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="输入关键词搜索..."
              className="w-full pl-10 pr-3 py-2.5 bg-gray-100 border-0 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* 筛选 */}
      <div className="px-4 py-3 overflow-x-auto bg-white border-b border-gray-200">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSortBy('relevance')}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'relevance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            相关度
          </button>
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'date' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            时间
          </button>
          <button
            onClick={() => setSortBy('citations')}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'citations' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            引用数
          </button>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="px-4 py-4">
        <p className="text-sm text-gray-500 mb-3">共 {mockResults.length} 条结果</p>
        
        <div className="space-y-3">
          {mockResults.map(result => (
            <Link
              key={result.id}
              href={`/discover/${result.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-1">{result.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{result.authors} · {result.year}</p>
              <p className="text-xs text-gray-500">{result.citations.toLocaleString()} 次引用</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}