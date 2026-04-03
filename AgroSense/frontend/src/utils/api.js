import axios from 'axios'

const DEFAULT_PROD_API_BASE_URL = ''

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '')

export const API_BASE_URL = configuredBaseUrl || (import.meta.env.DEV ? '' : DEFAULT_PROD_API_BASE_URL)

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem('agrosense_user')
    if (!rawUser) return config

    const user = JSON.parse(rawUser)
    config.headers = config.headers || {}

    if (user?.email) config.headers['X-User-Email'] = user.email
    if (user?.name) config.headers['X-User-Name'] = user.name
  } catch {}

  return config
})
