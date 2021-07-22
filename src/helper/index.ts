import qs from 'qs'
import { ajax } from 'rxjs/ajax'

export const API_URL = ' https://api.github.com'
export const HTTP_GET = (
  params: { [key: string]: unknown },
  resource: string
) => {
  return ajax.getJSON<githubRepoResponse>(
    `${API_URL}/${resource}?${qs.stringify(params)}`,
    {
      Accept: 'application/vnd.github.v3+json',
    }
  )
}

export const MAX_ITEMS_COUNT = 1000

export const DELAY = 1000
export const DELAY_SHORT = 150
export const DELAY_LONG = 1500

export const LIMIT_REQUEST_TIME = 60000
export const LIMIT_REQUEST_COUNT = 10
export const RETRY_TIMES = 99

export const INFINITE_SCROLL_THRESHOLD = 0.7

export interface githubRepoItem {
  name: string
  full_name: string
  url: string
  html_url: string
  stargazers_count: number
  description: string
}

export interface githubRepoResponse {
  items: githubRepoItem[]
  incomplete_results: boolean
  total_count: number
}
