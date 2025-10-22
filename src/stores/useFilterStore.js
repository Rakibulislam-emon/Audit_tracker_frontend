// stores/useFilterStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFilterStore = create(
  persist(
    (set, get) => ({
      // Filter states
      search: '',
      role: 'all',
      status: 'all',
      
      // Actions
      setSearch: (search) => set({ search }),
      setRole: (role) => set({ role }),
      setStatus: (status) => set({ status }),
      clearFilters: () => set({ search: '', role: 'all', status: 'all' }),
      
      // Get active filters for API
      getAPIFilters: () => {
        const { search, role, status } = get()
        const filters = {}
        
        if (search) filters.search = search
        if (role !== 'all') filters.role = role
        if (status !== 'all') filters.status = status
        
        return filters
      }
    }),
    {
      name: 'filter-storage', // localStorage key
    }
  )
)