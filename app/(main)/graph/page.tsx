'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, ZoomIn, ZoomOut, Maximize2, Filter, Download, Share2, Info, ChevronRight, GitBranch, Users, Clock, TrendingUp, Star, RefreshCw, FileText } from 'lucide-react'

// 模拟论文关系数据
const graphData = {
  nodes: [
    { id: 1, title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, citations: 89000, type: 'core', x: 400, y: 300 },
    { id: 2, title: 'BERT', authors: 'Devlin et al.', year: 2018, citations: 75000, type: 'derived', x: 250, y: 200 },
    { id: 3, title: 'GPT-2', authors: 'Radford et al.', year: 2019, citations: 32000, type: 'derived', x: 550, y: 200 },
    { id: 4, title: 'GPT-3', authors: 'Brown et al.', year: 2020, citations: 45000, type: 'derived', x: 650, y: 300 },
    { id: 5, title: 'Vision Transformer', authors: 'Dosovitskiy et al.', year: 2020, citations: 32000, type: 'derived', x: 300, y: 400 },
    { id: 6, title: 'LoRA', authors: 'Hu et al.', year: 2021, citations: 12000, type: 'derived', x: 500, y: 450 },
    { id: 7, title: 'InstructGPT', authors: 'Ouyang et al.', year: 2022, citations: 8500, type: 'derived', x: 700, y: 400 },
    { id: 8, title: 'ChatGPT', authors: 'OpenAI', year: 2022, citations: 15000, type: 'derived', x: 750, y: 350 },
    { id: 9, title: 'Seq2Seq', authors: 'Sutskever et al.', year: 2014, citations: 18000, type: 'precursor', x: 200, y: 300 },
    { id: 10, title: 'Neural Attention', authors: 'Bahdanau et al.', year: 2014, citations: 25000, type: 'precursor', x: 300, y: 150 },
  ],
  edges: [
    { source: 9, target: 1, type: 'influenced' },
    { source: 10, target: 1, type: 'influenced' },
    { source: 1, target: 2, type: 'cited' },
    { source: 1, target: 3, type: 'cited' },
    { source: 3, target: 4, type: 'cited' },
    { source: 1, target: 5, type: 'cited' },
    { source: 4, target: 6, type: 'cited' },
    { source: 4, target: 7, type: 'cited' },
    { source: 7, target: 8, type: 'cited' },
    { source: 1, target: 6, type: 'cited' },
  ],
}

const typeConfig = {
  core: { label: '核心论文', color: '#3b82f6', bg: '#dbeafe' },
  derived: { label: '衍生论文', color: '#10b981', bg: '#d1fae5' },
  precursor: { label: '先驱论文', color: '#f59e0b', bg: '#fef3c7' },
}

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<typeof graphData.nodes[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)

  const filteredNodes = graphData.nodes.filter(node => {
    const matchSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = filterType === 'all' || node.type === filterType
    return matchSearch && matchType
  })

  const handleNodeClick = (node: typeof graphData.nodes[0]) => {
    setSelectedNode(node)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左侧工具栏 */}
      <div className="w-64 bg-white border-r border-gray-100 p-4 flex flex-col">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">论文关系图谱</h1>
        <p className="text-xs text-gray-500 mb-4">可视化论文引用关系和研究脉络</p>

        {/* 搜索 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索论文..."
            className="w-full pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-xl text-sm"
          />
        </div>

        {/* 类型筛选 */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">论文类型</p>
          <div className="space-y-1">
            <button
              onClick={() => setFilterType('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm ${
                filterType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              全部论文
            </button>
            {Object.entries(typeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                  filterType === key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs font-medium text-gray-700 mb-2">图例说明</p>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-400" />
              <span>引用关系</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-amber-400 border-dashed border-t-2 border-amber-400" />
              <span>影响关系</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-auto space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm">
            <Download className="w-4 h-4" />
            导出图片
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm">
            <Share2 className="w-4 h-4" />
            分享图谱
          </button>
        </div>
      </div>

      {/* 中间图谱区域 */}
      <div className="flex-1 relative overflow-hidden bg-gray-100" ref={canvasRef}>
        {/* 缩放控制提示 */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-xs text-gray-500">
          缩放: {Math.round(zoom * 100)}% · 拖拽移动 · 点击查看详情
        </div>

        {/* 图谱画布 */}
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* 连线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {graphData.edges.map((edge, i) => {
              const source = graphData.nodes.find(n => n.id === edge.source)!
              const target = graphData.nodes.find(n => n.id === edge.target)!
              if (!filteredNodes.find(n => n.id === source.id) || !filteredNodes.find(n => n.id === target.id)) return null
              
              return (
                <line
                  key={i}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={edge.type === 'influenced' ? '#f59e0b' : '#93c5fd'}
                  strokeWidth={2}
                  strokeDasharray={edge.type === 'influenced' ? '5,5' : '0'}
                  opacity={0.6}
                />
              )
            })}
          </svg>

          {/* 节点 */}
          {filteredNodes.map(node => {
            const config = typeConfig[node.type as keyof typeof typeConfig]
            const isSelected = selectedNode?.id === node.id
            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: node.x, top: node.y }}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: config.bg, borderColor: config.color, borderWidth: 2 }}
                >
                  <p className="text-sm font-medium text-gray-900 max-w-[160px] truncate">{node.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{node.year} · {(node.citations / 1000).toFixed(0)}k 引用</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 右侧详情面板 */}
      {selectedNode && (
        <div className="w-72 bg-white border-l border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">论文详情</h2>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-base font-medium text-gray-900">{selectedNode.title}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedNode.authors}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded-lg text-xs"
                style={{ backgroundColor: typeConfig[selectedNode.type as keyof typeof typeConfig].bg, color: typeConfig[selectedNode.type as keyof typeof typeConfig].color }}
              >
                {typeConfig[selectedNode.type as keyof typeof typeConfig].label}
              </span>
              <span className="text-sm text-gray-500">{selectedNode.year}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{(selectedNode.citations / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">引用数</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {graphData.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                </p>
                <p className="text-xs text-gray-500">关联论文</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">关联论文</p>
              <div className="space-y-2">
                {graphData.edges
                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                  .slice(0, 4)
                  .map(edge => {
                    const relatedId = edge.source === selectedNode.id ? edge.target : edge.source
                    const related = graphData.nodes.find(n => n.id === relatedId)!
                    return (
                      <Link
                        key={related.id}
                        href={`/discover/${related.id}`}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl hover:bg-gray-100"
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate flex-1">{related.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </Link>
                    )
                  })}
              </div>
            </div>

            <Link
              href={`/reading/${selectedNode.id}`}
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
            >
              开始阅读
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}