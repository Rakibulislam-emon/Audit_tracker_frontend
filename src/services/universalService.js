
export const universalService = {
  // 1. GET ALL with filters
   getAll: async (token, endpoint, filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.append(key, value);
        }
      });

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error(`❌ Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  },
  // 2. CREATE new item
  create: async (token, endpoint, data) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }
    );
    
    if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
    const result = await response.json();
    console.log('✅ Created successfully:', result);
    return result;
  },

  // 3. UPDATE existing item
  update: async (token, endpoint, id, data) => {
    console.log('✏️ Updating:', endpoint, 'ID:', id, 'with data:', data);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }
    );
    
    if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
    const result = await response.json();
    console.log('✅ Updated successfully:', result);
    return result;
  },

  // 4. DELETE item
  delete: async (token, endpoint, id) => {
    console.log('🗑️ Deleting:', endpoint, 'ID:', id);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}/${id}`,
      {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
    const result = await response.json();
    console.log('✅ Deleted successfully:', result);
    return result;
  }
};