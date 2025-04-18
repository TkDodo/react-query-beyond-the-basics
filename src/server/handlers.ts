import { http, HttpResponse, bypass, delay } from 'msw'
import type { JsonBodyType } from 'msw'

import { get, set, createStore } from 'idb-keyval'
import { setupWorker } from 'msw/browser'

const openLibraryStore = createStore('open-library-store', 'open-library')

const openLibraryCache = {
  async get(key: string) {
    return await get<JsonBodyType>(key, openLibraryStore)
  },
  async set(key: string, value: JsonBodyType) {
    await set(key, value, openLibraryStore)
  },
}

const handlers = [
  http.get('https://openlibrary.org/*', async ({ request }) => {
    const cacheKey = request.url.toString()

    const cachedResponse = await openLibraryCache
      .get(cacheKey)
      .catch(() => null)
    if (cachedResponse) {
      await delay()
      return HttpResponse.json(cachedResponse, {
        headers: { 'x-msw-cache': 'true' },
      })
    }

    try {
      const response = await fetch(bypass(request))
      if (!response.ok) {
        return HttpResponse.error()
      }

      const data = (await response.json()) as JsonBodyType
      void openLibraryCache.set(cacheKey, data)

      return HttpResponse.json(data)
    } catch {
      return HttpResponse.error()
    }
  }),
]

export const worker = setupWorker(...handlers)
