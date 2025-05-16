import { router } from '@inertiajs/react'
import axios from 'axios'

function replaceParam(url: string, params: Record<string, string>): string {
  return url.replace(/\[([^\]]+)\]/g, (_, key) => params[key] || `[${key}]`)
}

const fetcherClient = axios.create({
  withCredentials: true,
})

type MethodConfig = {
  params?: Record<string, string>
  headers?: Record<string, string>
  client?: 'fetcher' | 'router'
}

export class FetcherResponse<T = any> {
  public data: T
  public status: number
  public statusText: string
  public request: {
    responseURL: string
  }

  constructor(data: T, status: number, statusText: string, request: { responseURL: string }) {
    this.data = data
    this.status = status
    this.statusText = statusText
    this.request = request
  }
}

export class FetcherError extends Error {
  public response: FetcherResponse

  constructor(message: string, response: FetcherResponse) {
    super(message)
    this.name = 'FetcherError'
    this.response = response

    Object.setPrototypeOf(this, FetcherError.prototype)
  }
}

export function isFetcherError(error: unknown): error is FetcherError {
  return error instanceof FetcherError
}
export function isFetcherResponse<T = any>(response: unknown): response is FetcherResponse<T> {
  return response instanceof FetcherResponse
}
export function isDefaultError(error: unknown): error is Error {
  return error instanceof Error
}
export function isAxiosError(error: unknown) {
  return axios.isAxiosError(error)
}

export class Fetcher {
  public async get<Response = any, Data = any>(
    url: string,
    data?: Data,
    config?: MethodConfig
  ): Promise<FetcherResponse<Response>> {
    return this.#request('get', url, data, config)
  }

  public async post<Response = any, Data = any>(
    url: string,
    data?: Data,
    config?: MethodConfig
  ): Promise<FetcherResponse<Response>> {
    return this.#request('post', url, data, config)
  }

  public async put<Response = any, Data = any>(
    url: string,
    data?: Data,
    config?: MethodConfig
  ): Promise<FetcherResponse<Response>> {
    return this.#request('put', url, data, config)
  }

  public async patch<Response = any, Data = any>(
    url: string,
    data?: Data,
    config?: MethodConfig
  ): Promise<FetcherResponse<Response>> {
    return this.#request('patch', url, data, config)
  }

  public async delete<Response = any, Data = any>(
    url: string,
    data?: Data,
    config?: MethodConfig
  ): Promise<FetcherResponse<Response>> {
    return this.#request('delete', url, data, config)
  }

  #request = async <Response = any, Data = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: Data,
    config?: MethodConfig
  ): Promise<FetcherResponse<Response>> => {
    const { params, headers, client = 'fetcher' } = config || {}

    const targetUrl = params ? replaceParam(url, params) : url

    const response = await fetcherClient<Response>({
      method,
      url: targetUrl,
      data,
      headers,
    })

    if (client === 'router') {
      const baseUrl = window.location.origin
      const fullUrl = response.request.responseURL.replace(baseUrl, '')

      router.visit(fullUrl)
    }

    const res = new FetcherResponse(
      response.data,
      response.status,
      response.statusText,
      response.request
    )

    if ([500, 401, 403].includes(response.status)) {
      throw new FetcherError(`Request failed with status code ${response.status}`, res)
    }

    return res
  }
}

export const fetcher = new Fetcher()
