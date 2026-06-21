// Service for Admin API endpoints connecting to FastAPI backend
import axios from 'axios'

const API_URL = 'https://mindheaven-tfbc.onrender.com/api/admin'

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`)
      return response.data
    } catch (error) {
      console.error("Error fetching stats:", error)
      throw error
    }
  },

  // Users
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      return response.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  createUser: async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData)
      return response.data
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`)
      return response.data
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  },

  updateUserStatus: async (userId: string, status: string) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}/status`, { status })
      return response.data
    } catch (error) {
      console.error("Error updating user status:", error)
      throw error
    }
  },

  // Counselors
  getCounselors: async () => {
    try {
      const response = await axios.get(`${API_URL}/counselors`)
      return response.data
    } catch (error) {
      console.error("Error fetching counselors:", error)
      throw error
    }
  },

  createCounselor: async (counselorData: any) => {
    try {
      const response = await axios.post(`${API_URL}/counselors`, counselorData)
      return response.data
    } catch (error) {
      console.error("Error creating counselor:", error)
      throw error
    }
  },

  updateCounselor: async (counselorId: string, counselorData: any) => {
    try {
      const response = await axios.patch(`${API_URL}/counselors/${counselorId}`, counselorData)
      return response.data
    } catch (error) {
      console.error("Error updating counselor:", error)
      throw error
    }
  },

  deleteCounselor: async (counselorId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/counselors/${counselorId}`)
      return response.data
    } catch (error) {
      console.error("Error deleting counselor:", error)
      throw error
    }
  },

  // Moderation
  getReportedPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/reports`)
      return response.data
    } catch (error) {
      console.error("Error fetching reported posts:", error)
      throw error
    }
  },

  handleReportAction: async (reportId: string, action: string, warningReason?: string) => {
    try {
      const response = await axios.post(`${API_URL}/reports/${reportId}/action`, {
        action,
        warning_reason: warningReason
      })
      return response.data
    } catch (error) {
      console.error("Error handling report action:", error)
      throw error
    }
  },

  // Crisis Alerts
  getCrisisAlerts: async () => {
    try {
      const response = await axios.get(`${API_URL}/crisis`)
      return response.data
    } catch (error) {
      console.error("Error fetching crisis alerts:", error)
      throw error
    }
  },

  handleCrisisAction: async (alertId: string, action: string, counselorName?: string) => {
    try {
      const response = await axios.post(`${API_URL}/crisis/${alertId}/action`, {
        action,
        counselor_name: counselorName
      })
      return response.data
    } catch (error) {
      console.error("Error handling crisis action:", error)
      throw error
    }
  },

  // Appointments
  getAppointments: async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments`)
      return response.data
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw error
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      const response = await axios.patch(`${API_URL}/appointments/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error("Error updating appointment status:", error)
      throw error
    }
  },

  // Blocked Users
  getBlockedUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/blocked-users`)
      return response.data
    } catch (error) {
      console.error("Error fetching blocked users:", error)
      throw error
    }
  },

  unblockUser: async (userId: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/unblock`)
      return response.data
    } catch (error) {
      console.error("Error unblocking user:", error)
      throw error
    }
  },
  // Get users with warnings
  getUserWarnings: async () => {
    try {
      const response = await axios.get(`${API_URL}/warnings`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user warnings:", error);
      throw error;
    }
  }
}
