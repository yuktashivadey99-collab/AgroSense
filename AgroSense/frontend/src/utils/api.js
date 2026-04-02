import axios from 'axios'

const DEFAULT_PROD_API_BASE_URL = 'https://agrosense-qnhc.onrender.com'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '')

export const API_BASE_URL = configuredBaseUrl || (import.meta.env.DEV ? '' : DEFAULT_PROD_API_BASE_URL)

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})
