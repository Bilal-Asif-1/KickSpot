import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      try { localStorage.setItem('theme', 'dark') } catch {}
    } else {
      document.documentElement.classList.remove('dark')
      try { localStorage.setItem('theme', 'light') } catch {}
    }
  }, [dark])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') {
        setDark(true)
        document.documentElement.classList.add('dark')
      } else if (saved === 'light') {
        setDark(false)
        document.documentElement.classList.remove('dark')
      }
    } catch {}
  }, [])

  return (
    <Button variant="outline" size="sm" onClick={() => setDark(v => !v)}>
      {dark ? 'Light' : 'Dark'}
    </Button>
  )
}


