'use client'

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token')
    if (token) {
      config.headers = config.headers ?? {}
      if (!('Authorization' in config.headers)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(config.headers as any).Authorization = `Bearer ${token}`
      }
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const envelope = response.data

    if (
      envelope &&
      typeof envelope === 'object' &&
      'statusCode' in envelope &&
      'isError' in envelope &&
      'data' in envelope
    ) {
      if (envelope.isError) {
        const messages = Array.isArray(envelope.message)
          ? envelope.message
          : [envelope.message || envelope.error || 'Request failed']
        const error = new Error(messages[0] ?? 'Request failed')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(error as any).response = { status: envelope.statusCode, data: envelope }
        throw error
      }

      return {
        ...response,
        data: envelope.data,
      }
    }

    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { api }
