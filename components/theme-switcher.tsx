'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Leaf, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'green' | 'system'

const themes: Record<Theme, { label: string; icon: any; class: string }> = {
  light: { label: '浅色', icon: Sun, class: '' },
  dark: { label: '深色', icon: Moon, class: 'dark' },
  green: { label: '护眼', icon: Leaf, class: 'theme-green' },
  system: { label: '跟随系统', icon: Monitor, class: '' },
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme
    if (saved && themes[saved]) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    // 移除所有主题类
    root.classList.remove('dark', 'theme-green')
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      }
    } else if (themes[newTheme].class) {
      root.classList.add(themes[newTheme].class)
    }
    
    localStorage.setItem('theme', newTheme)
  }

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return { theme, changeTheme, themes }
}

interface ThemeSwitcherProps {
  compact?: boolean
}

export default function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { theme, changeTheme, themes } = useTheme()
  const [showMenu, setShowMenu] = useState(false)

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {(Object.keys(themes) as Theme[]).map(t => {
          const config = themes[t]
          return (
            <button
              key={t}
              onClick={() => changeTheme(t)}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === t ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              title={config.label}
            >
              <config.icon className="w-4 h-4 text-gray-600" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {themes[theme].icon && (() => {
          const Icon = themes[theme].icon
          return <Icon className="w-4 h-4 text-gray-600" />
        })()}
        <span className="text-sm text-gray-700">{themes[theme].label}</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-50">
          {(Object.keys(themes) as Theme[]).map(t => {
            const config = themes[t]
            return (
              <button
                key={t}
                onClick={() => { changeTheme(t); setShowMenu(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  theme === t ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <config.icon className="w-4 h-4" />
                <span className="text-sm">{config.label}</span>
                {theme === t && <span className="text-xs text-blue-500">当前</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}