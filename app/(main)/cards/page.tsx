'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Tag, FileText, Layers, Star } from 'lucide-react'

const mockCards = [
  { id: 1, title: 'Transformer 架构', type: 'concept', tags: ['NLP', 'Attention'], paper: 'Attention Is All You Need', created: '2024-05-10' },
  { id: 2, title: 'Multi-Head Attention', type: 'method', tags: ['NLP', 'Attention'], paper: 'Attention Is All You Need', created: '2024-05-10' },
  { id: 3, title: 'Self-Attention 公式', type: 'formula', tags: ['NLP', '公式'], paper: 'Attention Is All You Need', created: '2024-05-11' },
  { id: 4, title: 'BERT 预训练方法', type: 'method', tags: ['NLP', 'BERT'], paper: 'BERT 论文', created: '2024-05-12' },
  { id: 5, title: 'LoRA 微调', type: 'method', tags: ['Fine-tuning', 'LLM'], paper: 'LoRA 论文', created: '2024-05-12' },
]

const typeConfig = {
  concept: { label: '概念', color: 'bg-blue-100 text-blue-700' },
  method: { label: '方法', color: 'bg-green-100 text-green-700' },
  formula: { label: '公式', color: 'bg-purple-100 text-purple-700' },
}

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const allTags = Array.from(new Set(mockCards.flatMap(c => c.tags)))

  const filteredCards = mockCards.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = !selectedType || c.type === selectedType
    return matchSearch && matchType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">知识卡片</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
              <Plus className="w-4 h-4" />
              新建
            </button>
          </div>
          
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索卡片..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* 类型筛选 */}
      <div className="px-6 py-4 overflow-x-auto bg-white border-b border-gray-100">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
              selectedType === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            全部 ({mockCards.length})
          </button>
          {Object.entries(typeConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
                selectedType === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="px-6 py-6">
        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">暂无卡片</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCards.map(card => {
              const type = typeConfig[card.type as keyof typeof typeConfig]
              return (
                <div key={card.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">{card.title}</h3>
                    <span className={`px-2 py-1 rounded-lg text-xs ${type.color}`}>
                      {type.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">来源: {card.paper}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}