import { useMutation } from '@tanstack/react-query'

import { fetcher } from './client'

export function useLoginMutation(world: string) {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      await fetcher.post('/[world]/login', data, {
        params: { world },
        client: 'router',
      })
    },
  })
}
