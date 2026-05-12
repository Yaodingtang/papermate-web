'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Folder, Tag, MoreHorizontal, FileText, Clock, CheckCircle, Grid, List, ChevronRight, Upload } from 'lucide-react'

const mockPapers = [
  { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, status: 'reading', progress: 80, folder: 'Transformer' },
  { id: 2, title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, status: 'completed', progress: 100, folder: 'Transformer' },
  { id: 3, title: 'GPT-4 Technical Report', authors: 'OpenAI', year: 2023, status: 'unread', progress: 0, folder: 'LLM' },
  { id: 4, title: 'LoRA: Low-Rank Adaptation', authors: 'Hu et al.', year: 2021, status: 'reading', progress: 45, folder: 'Fine-tuning' },
  { id: 5, title: 'Vision Transformer', authors: 'Dosovitskiy et al.', year: 2020, status: 'completed', progress: 100, folder: 'Vision' },
]

const mockFolders = [
  { name: 'Transformer', count: 12 },
  { name: 'LLM', count: 8 },
  { name: 'Vision', count: 5 },
  { name: 'Fine-tuning', count: 3 },
]

export default function BookshelfPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  const filteredPapers = mockPapers.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFolder = !selectedFolder || p.folder === selectedFolder
    return matchSearch && matchFolder
  })

  const statusConfig = {
    reading: { label: '阅读中', color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { label: '已完成', color: 'text-green-600', bg: 'bg-green-100' },
    unread: { label: '未读', color: 'text-gray-500', bg: 'bg-gray-100' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">我的书架</h1>
            <div className="flex items-center gap-2">
              <Link href="/bookshelf/upload" className="p-2 bg-blue-600 text-white rounded-xl">
                <Plus className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索论文..."
              className="w-full pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* 文件夹标签 */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
              selectedFolder === null ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            全部 ({mockPapers.length})
          </button>
          {mockFolders.map(folder => (
            <button
              key={folder.name}
              onClick={() => setSelectedFolder(folder.name)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
                selectedFolder === folder.name ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {folder.name} ({folder.count})
            </button>
          ))}
        </div>
      </div>

      {/* 论文列表 */}
      <div className="px-4 py-2">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">暂无论文</p>
            <Link href="/bookshelf/upload" className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">
              <Upload className="w-4 h-4" />
              上传论文
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPapers.map(paper => {
              const status = statusConfig[paper.status as keyof typeof statusConfig]
              return (
                <Link
                  key={paper.id}
                  href={`/reading/${paper.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{paper.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{paper.authors} · {paper.year}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-lg text-xs ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                        {paper.progress > 0 && paper.progress < 100 && (
                          <span className="text-xs text-gray-500">{paper.progress}%</span>
                        )}
                      </div>
                      {paper.progress > 0 && paper.progress < 100 && (
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${paper.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-3" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}