import { router } from '@inertiajs/react'
import axios, { AxiosError } from 'axios'

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
  revalidate?: {
    only?: string[]
    except?: string[]
  }
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

export class FetcherValidationError extends FetcherError {
  constructor(
    message: string,
    response: FetcherResponse,
    public readonly errors: Array<{ message: string; rule: string; field: string }>
  ) {
    super(message, response)
    this.name = 'FetcherValidationError'

    Object.setPrototypeOf(this, FetcherValidationError.prototype)
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
export function isValidationError(error: unknown): error is FetcherValidationError {
  return error instanceof FetcherValidationError
}

export function isApiValidationError(error: AxiosError<any>) {
  return error.response?.data?.errors !== undefined && error.response?.status === 422
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
    try {
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

      if (config?.revalidate) {
        const { only } = config.revalidate

        router.reload({
          only,
        })
      }

      return res
    } catch (error) {
      if (isAxiosError(error)) {
        const res = new FetcherResponse(
          error.response?.data,
          error.response?.status || 0,
          error.response?.statusText || '',
          error.response?.request
        )

        if (isApiValidationError(error)) {
          throw new FetcherValidationError(
            `Request failed with status code ${error.response?.status}`,
            res,
            error?.response?.data.errors || []
          )
        }

        throw new FetcherError(`Request failed with status code ${error.response?.status}`, res)
      }

      if (isDefaultError(error)) {
        throw new FetcherError(error.message, new FetcherResponse(null, 0, '', { responseURL: '' }))
      }

      throw error
    }
  }
}

export const fetcher = new Fetcher()
