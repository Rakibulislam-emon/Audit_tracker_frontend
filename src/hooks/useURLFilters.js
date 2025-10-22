// hooks/useURLFilters.js
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export const useURLFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get current state from URL
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || 'all'
  const status = searchParams.get('status') || 'all'
  const sort = searchParams.get('sort') || 'name-asc'
  const page = parseInt(searchParams.get('page') || '1')

  // Update URL without page refresh
  const updateURL = useDebouncedCallback((updates) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to page 1 when filters change (industry standard)
    if (updates.search || updates.role || updates.status) {
      params.set('page', '1')
    }
    
    const newUrl = `${pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }, 300)

  // Individual actions
  const setSearch = (value) => updateURL({ search: value })
  const setRole = (value) => updateURL({ role: value })
  const setStatus = (value) => updateURL({ status: value })
  const setSort = (value) => updateURL({ sort: value })
  const setPage = (value) => updateURL({ page: value })

  const clearFilters = () => {
    router.push(pathname, { scroll: false })
  }

  // Get API-ready filters
  const getAPIFilters = () => {
    const filters = {}
    if (search) filters.search = search
    if (role !== 'all') filters.role = role
    if (status !== 'all') filters.status = status
    if (page > 1) filters.page = page
    return filters
  }

  return {
    // State
    search,
    role, 
    status,
    sort,
    page,
    
    // Actions
    setSearch,
    setRole,
    setStatus, 
    setSort,
    setPage,
    clearFilters,
    getAPIFilters
  }
}