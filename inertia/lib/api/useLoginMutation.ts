import { useMutation } from '@tanstack/react-query'

import { fetcher } from './client'

export function useLoginMutation(world: string) {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetcher.post(
        fetcher.replaceParam('/[world]/login', {
          world,
        }),
        data
      )

      if (![200, 302].includes(response.status)) {
        throw new Error('Login failed')
      }
    },
  })
}
