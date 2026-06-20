import axios from 'axios'

const API_URL = 'http://localhost:8000/api/public'

export const publicService = {
  getCounselors: async () => {
    try {
      const response = await axios.get(`${API_URL}/counselors`)
      return response.data
    } catch (error) {
      console.error("Error fetching public counselors:", error)
      throw error
    }
  },

  getCounselorDetails: async (counselorId: string) => {
    try {
      const response = await axios.get(`${API_URL}/counselors/${counselorId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching counselor details:", error)
      throw error
    }
  },

  getCounselorsBySpecialization: async (specialization: string) => {
    try {
      const response = await axios.get(`${API_URL}/counselors/by-specialization/${specialization}`)
      return response.data
    } catch (error) {
      console.error("Error fetching counselors by specialization:", error)
      throw error
    }
  },

  bookAppointment: async (appointmentData: { counselor_id: string, user_id: string, appointment_date: string, appointment_time: string, notes: string }) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, appointmentData)
      return response.data
    } catch (error) {
      console.error("Error booking appointment:", error)
      throw error
    }
  }
}
