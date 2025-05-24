import { useMutation } from '@tanstack/react-query'

import { NewWorldFormValues } from '@/components/forms/new-world-form'

import { fetcher } from './client'

export function useCreateWorldMutation() {
  return useMutation({
    mutationFn: async (data: NewWorldFormValues) => {
      await fetcher.post('/worlds', data, {
        revalidate: {
          only: ['worlds'],
        },
      })
    },
  })
}
