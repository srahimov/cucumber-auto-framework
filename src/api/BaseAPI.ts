import axios, { AxiosInstance, AxiosResponse } from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

export class BaseAPI {
  protected client: AxiosInstance
  protected baseURL: string

  constructor() {
    this.baseURL = process.env.API_BASE_URL ?? 'https://automationexercise.com/api'

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    // Request interceptor — log every outgoing request
    this.client.interceptors.request.use((config) => {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
      return config
    })

    // Response interceptor — log status of every response
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error(`[API] Error: ${error.response?.status} ${error.config?.url}`)
        return Promise.reject(error)
      }
    )
  }

  async get(endpoint: string, params?: Record<string, unknown>): Promise<AxiosResponse> {
    return this.client.get(endpoint, { params })
  }

  async post(endpoint: string, data?: unknown): Promise<AxiosResponse> {
    return this.client.post(endpoint, data)
  }

  async postForm(endpoint: string, formData: Record<string, string>): Promise<AxiosResponse> {
    const params = new URLSearchParams(formData)
    return this.client.post(endpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }

  async put(endpoint: string, data?: unknown): Promise<AxiosResponse> {
    return this.client.put(endpoint, data)
  }

  async delete(endpoint: string, params?: Record<string, string>): Promise<AxiosResponse> {
    return this.client.delete(endpoint, { params })
  }

  parseResponse(responseData: string | object): Record<string, unknown> {
    if (typeof responseData === 'string') {
      return JSON.parse(responseData)
    }
    return responseData as Record<string, unknown>
  }
}
