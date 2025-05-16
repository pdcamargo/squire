import { router } from '@inertiajs/react'
import axios, { AxiosInstance } from 'axios'

export const fetcher2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
}) as AxiosInstance & {
  replaceParam: (url: string, params: Record<string, string>) => string
}

function replaceParam(url: string, params: Record<string, string>): string {
  return url.replace(/\[([^\]]+)\]/g, (_, key) => params[key] || `[${key}]`)
}

fetcher2.replaceParam = replaceParam

const create = () =>
  ({
    // Define fetcher.get to mimic axios.get using router.get
    get: (url: string, data?: any, config: any = {}) => {
      return router.get(url, data, config)
    },

    // Define post to mimic axios.post using router.post
    post: (url: string, data?: any, config: any = {}) => {
      return router.post(url, data, config)
    },

    // Define put to mimic axios.put using router.put
    put: (url: string, data?: any, config: any = {}) => {
      return router.put(url, data, config)
    },
  }) as typeof fetcher2

export const fetcher = create()

fetcher.replaceParam = replaceParam
