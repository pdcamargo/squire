import { useMutation } from '@tanstack/react-query'

import { NewSystemFormValues } from '@/components/forms/new-system-form'

import { fetcher } from './client'

export function useCreateSystemMutation() {
  return useMutation({
    mutationFn: async (data: NewSystemFormValues) => {
      await fetcher.post('/systems', data, {
        revalidate: {
          only: ['systems'],
        },
      })
    },
  })
}
