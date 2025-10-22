// src/app/dashboard/test-direct/page.js
"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function TestDirect() {
  const router = useRouter()
  const pathname = usePathname()
  const [input, setInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (input) params.set('q', input)
      const newUrl = params.toString() ? `${pathname}?${params}` : pathname
      router.replace(newUrl, { scroll: false })
    }, 500)
    return () => clearTimeout(timer)
  }, [input, pathname, router])

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test - Outside [role] Segment</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here..."
        className="border p-2 rounded w-full"
      />
      <p className="mt-4 text-sm text-gray-600">
        If this doesn t refresh, the [role] segment is your problem
      </p>
    </div>
  )
}