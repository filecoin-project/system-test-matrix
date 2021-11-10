import axios from 'axios'

export const HttpClient = axios.create({
  baseURL: process.env.API_ENDPOINT,
})

export function setApiKeyHeader(token: string) {
  HttpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
