'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, X, ChevronRight, FileText, Calendar, Users, ArrowLeftRight, Table2, List, BarChart3, Check, AlertCircle } from 'lucide-react'

const availablePapers = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, venue: 'NeurIPS', citations: 89000 },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, venue: 'NAACL', citations: 75000 },
  { id: 3, title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020, venue: 'NeurIPS', citations: 45000 },
  { id: 4, title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: 'Hu et al.', year: 2021, venue: 'ICLR', citations: 12000 },
]

const comparisonData = {
  methods: {
    '核心架构': ['Transformer', 'Transformer', 'Transformer', 'LoRA'],
    '参数规模': ['65M', '340M', '175B', '微调方法'],
    '训练数据': ['WMT', 'BooksCorpus', 'Common Crawl', '任务数据'],
    '主要任务': ['翻译', '理解', '生成', '微调'],
  },
  results: {
    '性能指标': ['BLEU 28.4', 'GLUE 80.4', 'Few-shot', '高效微调'],
  },
}

export default function ComparePage() {
  const [selectedPapers, setSelectedPapers] = useState<number[]>([1, 2])
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'methods' | 'results'>('methods')

  const papersToCompare = selectedPapers.map(id => availablePapers.find(p => p.id === id)!)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">论文对比</h1>
              <p className="text-sm text-gray-500 mt-1">选择多篇论文进行并排对比分析</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              disabled={selectedPapers.length >= 4}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              添加论文
            </button>
          </div>

          {/* 已选论文 */}
          <div className="flex items-center gap-3 mt-4">
            {papersToCompare.map((paper, index) => (
              <div key={paper.id} className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{paper.title}</span>
                <button onClick={() => setSelectedPapers(selectedPapers.filter(id => id !== paper.id))} className="p-0.5 hover:bg-blue-100 rounded-lg">
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 对比内容 */}
      <div className="px-6 py-6">
        {/* Tab */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('methods')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === 'methods' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            方法对比
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === 'results' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            结果对比
          </button>
        </div>

        {/* 对比表格 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-4 text-sm font-medium text-gray-500 w-40">对比项</th>
                {papersToCompare.map((paper, i) => (
                  <th key={paper.id} className="text-left px-5 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs">{i + 1}</span>
                      <span className="truncate max-w-[180px]">{paper.title}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(activeTab === 'methods' ? comparisonData.methods : comparisonData.results).map(([key, values]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-700">{key}</td>
                  {selectedPapers.map((_, i) => (
                    <td key={i} className="px-5 py-4 text-sm text-gray-600">{values[i] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加论文弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">添加论文</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availablePapers.filter(p => !selectedPapers.includes(p.id)).map(paper => (
                <button
                  key={paper.id}
                  onClick={() => { setSelectedPapers([...selectedPapers, paper.id]); setShowAddModal(false) }}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl text-left border border-gray-100"
                >
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{paper.title}</p>
                    <p className="text-xs text-gray-500">{paper.authors} · {paper.year}</p>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(false)} className="mt-4 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}