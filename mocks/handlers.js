import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/reviews', () => {
    return HttpResponse.json([{ id: '1', author: 'John Maverick', text: 'mocked review' }])
  }),
]
