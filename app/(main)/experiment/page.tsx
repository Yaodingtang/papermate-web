'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, FlaskConical, Calendar, CheckCircle, Clock, XCircle, ChevronRight, Play, Pause, BarChart3, FileText, Image, Database, MoreHorizontal, Edit3, Trash2, Copy } from 'lucide-react'

const mockExperiments = [
  {
    id: 1,
    title: 'Transformer vs RNN 序列建模对比',
    description: '对比 Transformer 与 RNN 在长序列建模任务上的性能差异，测试不同序列长度下的准确率和训练速度',
    status: 'completed',
    date: '2024-05-08',
    duration: '3天',
    results: 'Transformer 在序列长度 > 100 时表现显著优于 RNN，训练速度提升 5x',
    metrics: { accuracy: 94.2, loss: 0.032, speed: '5x' },
    papers: ['Attention Is All You Need'],
    datasets: ['WMT14', 'PTB'],
    modelParams: { layers: 6, heads: 8, d_model: 512 },
  },
  {
    id: 2,
    title: 'BERT 预训练参数调优实验',
    description: '测试不同 batch size、learning rate 和 warmup steps 对 BERT 预训练效果的影响',
    status: 'running',
    date: '2024-05-10',
    duration: '进行中',
    progress: 65,
    currentStep: '正在训练 batch_size=32 配置',
    results: null,
    papers: ['BERT: Pre-training of Deep Bidirectional Transformers'],
    datasets: ['WikiText-103', 'BookCorpus'],
  },
  {
    id: 3,
    title: 'LoRA 微调效率测试',
    description: '评估 LoRA 在不同 rank 设置下的微调效果和参数效率',
    status: 'running',
    date: '2024-05-11',
    duration: '进行中',
    progress: 30,
    currentStep: 'rank=8 实验完成，正在测试 rank=16',
    results: null,
    papers: ['LoRA: Low-Rank Adaptation of Large Language Models'],
  },
  {
    id: 4,
    title: 'CoT 推理能力评估',
    description: '评估 Chain-of-Thought Prompting 在数学推理任务上的表现',
    status: 'pending',
    date: '2024-05-12',
    duration: '计划中',
    results: null,
    papers: ['Chain-of-Thought Prompting Elicits Reasoning'],
    datasets: ['GSM8K', 'SVAMP'],
  },
  {
    id: 5,
    title: '多模态模型对比实验',
    description: '对比 CLIP、BLIP、LLaVA 在图文检索任务上的性能',
    status: 'completed',
    date: '2024-05-05',
    duration: '5天',
    results: 'LLaVA 在 zero-shot 检索上表现最佳，BLIP 训练效率最高',
    metrics: { recall: 87.3, precision: 82.1 },
    papers: ['CLIP', 'BLIP', 'LLaVA'],
  },
]

const statusConfig = {
  pending: { icon: Clock, label: '待开始', color: 'bg-amber-100 text-amber-700', bgColor: 'bg-amber-50' },
  running: { icon: Play, label: '进行中', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50' },
  completed: { icon: CheckCircle, label: '已完成', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50' },
  paused: { icon: Pause, label: '已暂停', color: 'bg-gray-100 text-gray-700', bgColor: 'bg-gray-50' },
}

export default function ExperimentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedExp, setSelectedExp] = useState<any>(null)

  const filteredExperiments = mockExperiments.filter(exp => {
    const matchSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'all' || exp.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: mockExperiments.length,
    running: mockExperiments.filter(e => e.status === 'running').length,
    completed: mockExperiments.filter(e => e.status === 'completed').length,
    pending: mockExperiments.filter(e => e.status === 'pending').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">实验记录</h1>
              <p className="text-gray-500 text-sm mt-1">管理实验进度，记录实验结果，追踪研究进展</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200">
                <Database className="w-4 h-4" />
                数据集管理
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                新建实验
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">总实验</div>
                </div>
                <FlaskConical className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.running}</div>
                  <div className="text-sm text-blue-600">进行中</div>
                </div>
                <Play className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                  <div className="text-sm text-green-600">已完成</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
                  <div className="text-sm text-amber-600">待开始</div>
                </div>
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索实验..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            {[
              { value: 'all', label: '全部' },
              { value: 'running', label: '进行中' },
              { value: 'completed', label: '已完成' },
              { value: 'pending', label: '待开始' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            时间筛选
          </button>
        </div>
      </div>

      {/* 实验列表 */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        {filteredExperiments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">暂无实验记录</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">创建第一个实验</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExperiments.map(exp => {
              const status = statusConfig[exp.status as keyof typeof statusConfig]
              return (
                <div 
                  key={exp.id} 
                  className={`bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-all cursor-pointer ${selectedExp === exp.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedExp(selectedExp === exp.id ? null : exp.id)}
                >
                  {/* 头部 */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bgColor}`}>
                        <FlaskConical className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
                        
                        {/* 元信息 */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {exp.date}
                          </span>
                          <span>时长: {exp.duration}</span>
                          {exp.datasets && (
                            <span>数据集: {exp.datasets.join(', ')}</span>
                          )}
                        </div>

                        {/* 关联论文 */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {exp.papers.map(paper => (
                            <span key={paper} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {paper}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2">
                      {exp.status === 'running' && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Pause className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      {exp.status === 'paused' && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Play className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* 进度条（进行中的实验） */}
                  {exp.status === 'running' && exp.progress && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">{exp.currentStep}</span>
                        <span className="font-medium text-blue-600">{exp.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${exp.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* 结果展示（已完成的实验） */}
                  {exp.status === 'completed' && exp.results && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 font-medium mb-1">实验结论</p>
                          <p className="text-sm text-gray-700">{exp.results}</p>
                        </div>
                        {exp.metrics && (
                          <div className="flex gap-2">
                            {Object.entries(exp.metrics).map(([key, value]) => (
                              <div key={key} className="px-3 py-2 bg-gray-50 rounded-lg text-center">
                                <div className="text-lg font-bold text-gray-900">{value}</div>
                                <div className="text-xs text-gray-500">{key}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 展开详情 */}
                  {selectedExp === exp.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">实验配置</h4>
                          <div className="space-y-1 text-sm">
                            {exp.modelParams && Object.entries(exp.modelParams).map(([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span className="text-gray-500">{k}:</span>
                                <span className="text-gray-900">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">数据集</h4>
                          <div className="space-y-1">
                            {exp.datasets?.map(ds => (
                              <div key={ds} className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-700">{ds}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">操作</h4>
                          <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                              <BarChart3 className="w-4 h-4" />
                              查看详细结果
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                              <Image className="w-4 h-4" />
                              查看图表
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                              <Copy className="w-4 h-4" />
                              复制实验配置
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}