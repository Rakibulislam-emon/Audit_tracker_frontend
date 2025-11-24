// src/services/dashboardService.js
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const dashboardService = {
  /**
   * Get dashboard KPI statistics
   * @param {string} token - JWT auth token
   * @returns {Promise} Dashboard stats (activeAuditSessions, pendingApprovals, openProblems, complianceScore, overdueItems)
   */
  getDashboardStats: async (token) => {
    try {
      console.log("🔍 Fetching dashboard stats");
      const url = `${baseUrl}/dashboard/stats`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status} - Failed to fetch dashboard stats: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Successfully fetched dashboard stats:", result);
      return result;
    } catch (error) {
      console.error("❌ API Error for dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Get recent activity feed
   * @param {string} token - JWT auth token
   * @param {number} limit - Number of activities to fetch (default: 20)
   * @returns {Promise} Array of recent activities
   */
  getRecentActivity: async (token, limit = 20) => {
    try {
      console.log(`🔍 Fetching recent activity (limit: ${limit})`);
      const url = `${baseUrl}/dashboard/recent-activity?limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status} - Failed to fetch recent activity: ${errorText}`
        );
      }

      const result = await response.json();
      console.log(
        `✅ Successfully fetched ${result.data?.length || 0} activities`
      );
      return result;
    } catch (error) {
      console.error("❌ API Error for recent activity:", error);
      throw error;
    }
  },

  /**
   * Get audit status distribution for chart
   * @param {string} token - JWT auth token
   * @returns {Promise} Object with counts by status (planned, in-progress, completed, cancelled)
   */
  getAuditStatusDistribution: async (token) => {
    try {
      console.log("🔍 Fetching audit status distribution");
      const url = `${baseUrl}/dashboard/audit-status-distribution`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status} - Failed to fetch audit status distribution: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Successfully fetched audit status distribution:", result);
      return result;
    } catch (error) {
      console.error("❌ API Error for audit status distribution:", error);
      throw error;
    }
  },

  /**
   * Get audit progress stats
   * @param {string} token - JWT auth token
   */
  getAuditProgress: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/audit-progress`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch audit progress");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for audit progress:", error);
      throw error;
    }
  },

  /**
   * Get problems by severity
   * @param {string} token - JWT auth token
   */
  getProblemsBySeverity: async (token) => {
    try {
      const response = await fetch(
        `${baseUrl}/dashboard/problems-by-severity`,
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch problems by severity");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for problems by severity:", error);
      throw error;
    }
  },

  /**
   * Get risk matrix data
   * @param {string} token - JWT auth token
   */
  getRiskMatrix: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/risk-matrix`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch risk matrix");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for risk matrix:", error);
      throw error;
    }
  },

  /**
   * Get site performance stats
   * @param {string} token - JWT auth token
   */
  getSitePerformance: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/site-performance`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch site performance");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for site performance:", error);
      throw error;
    }
  },

  /**
   * Get upcoming scheduled audits
   * @param {string} token - JWT auth token
   */
  getUpcomingSchedules: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/upcoming-schedules`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch upcoming schedules");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for upcoming schedules:", error);
      throw error;
    }
  },

  /**
   * Get team performance leaderboard
   * @param {string} token - JWT auth token
   */
  getTeamPerformance: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/team-performance`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch team performance");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for team performance:", error);
      throw error;
    }
  },

  /**
   * Get approval workflow funnel
   * @param {string} token - JWT auth token
   */
  getApprovalFunnel: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/approval-funnel`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch approval funnel");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for approval funnel:", error);
      throw error;
    }
  },

  /**
   * Get fix actions status
   * @param {string} token - JWT auth token
   */
  getFixActionsStatus: async (token) => {
    try {
      const response = await fetch(`${baseUrl}/dashboard/fix-actions-status`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!response.ok) throw new Error("Failed to fetch fix actions status");
      return await response.json();
    } catch (error) {
      console.error("❌ API Error for fix actions status:", error);
      throw error;
    }
  },
};

export default dashboardService;
