/**
 * UNIVERSAL API SERVICE
 * 
 * This is the BRAIN that connects configuration to real API calls
 * One service to handle ALL entities: users, groups, companies, etc.
 */
// base url
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const universalService = {
  
  /**
   * GET ALL ITEMS with filtering
   * 
   * @param {string} token - JWT auth token
   * @param {string} endpoint - API endpoint like "users", "groups" 
   * @param {object} filters - Frontend filter values {search: "john", status: "active"}
   * @returns {Promise} - Standardized response {success, data, count}
   * 
   * FLOW: Frontend filters → Service maps → Backend receives → Backend converts → Database query
   */
  getAll: async (token, endpoint, filters = {}) => {
    try {
      console.log(`🔍 Fetching ${endpoint} with filters:`, filters);

      // 1. BUILD QUERY PARAMETERS
      const params = new URLSearchParams();
      
      // Only add non-empty filter values
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'all') {
          params.append(key, value);
        }
      });

      // 2. CONSTRUCT URL
      const url = `${baseUrl}/${endpoint}?${params.toString()}`;
      console.log(`🌐 API Call: ${url}`);

      // 3. MAKE HTTP REQUEST
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
      });
//  console.log(response, "from 48")
      // return

      // 4. HANDLE HTTP ERRORS
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} - Failed to fetch ${endpoint}: ${errorText}`);
      }

      // 5. PARSE SUCCESSFUL RESPONSE
      const result = await response.json();
      console.log('result:', result)
      // 6. VALIDATE RESPONSE STRUCTURE
      if (!result || typeof result !== 'object') {
        throw new Error(`Invalid response format from ${endpoint}`);
      }

      console.log(`✅ Successfully fetched ${result.data?.length || 0} ${endpoint}`);
      return result;

    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error; // Let React Query handle the error
    }
  },

  /**
   * CREATE NEW ITEM
   * 
   * @param {string} token - JWT token
   * @param {string} endpoint - API endpoint
   * @param {object} data - Form data to create
   * @returns {Promise} - Created item
   * 
   * FLOW: UniversalForm data → Service sends → Backend creates → Returns new item
   */
  create: async (token, endpoint, data) => {
    try {
      console.log(`🆕 Creating from 86 line${endpoint}:`, data);

      const response = await fetch(
        `${baseUrl}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
console.log(response,"from 99")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - Failed to create ${endpoint}`);
      }

      const result = await response.json();
      console.log(`✅ Created ${endpoint} successfully:`, result);
      return result;

    } catch (error) {
      console.error(`❌ Create failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * UPDATE EXISTING ITEM
   * 
   * @param {string} token - JWT token  
   * @param {string} endpoint - API endpoint
   * @param {string} id - Item ID to update
   * @param {object} data - Updated data (partial or full)
   * @returns {Promise} - Updated item
   * 
   * FLOW: Edit form data → Service sends PATCH → Backend updates → Returns updated item
   */
  update: async (token, endpoint, id, data) => {
    try {
      console.log(`✏️ Updating ${endpoint} ${id}:`, data);

      const response = await fetch(
        `${baseUrl}/${endpoint}/${id}`,
        {
          method: 'PATCH', // Using PATCH for partial updates
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
 console.log(response,"form 140")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - Failed to update ${endpoint}`);
      }

      const result = await response.json();
      console.log(`✅ Updated ${endpoint} successfully:`, result);
      return result;

    } catch (error) {
      console.error(`❌ Update failed for ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * DELETE ITEM
   * 
   * @param {string} token - JWT token
   * @param {string} endpoint - API endpoint  
   * @param {string} id - Item ID to delete
   * @returns {Promise} - Delete confirmation
   * 
   * FLOW: Delete action → Service sends DELETE → Backend removes → Returns confirmation
   */
  delete: async (token, endpoint, id) => {
    try {
      console.log(`🗑️ Deleting ${endpoint} ${id}`);

      const response = await fetch(
        `${baseUrl}/${endpoint}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - Failed to delete ${endpoint}`);
      }

      // Handle both JSON and empty responses
      const contentLength = response.headers.get('Content-Length');
      let result;
      
      if (contentLength && contentLength !== '0') {
        result = await response.json();
      } else {
        result = { success: true, message: 'Item deleted successfully' };
      }

      console.log(`✅ Deleted ${endpoint} successfully:`, result);
      return result;

    } catch (error) {
      console.error(`❌ Delete failed for ${endpoint}:`, error);
      throw error;
    }
  },
};