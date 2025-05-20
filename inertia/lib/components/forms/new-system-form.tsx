import { Infer } from '@vinejs/vine/types'
import { useFormContext } from 'react-hook-form'

import { createSystemSchema } from '#validators/system'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   MultiSelector,
//   MultiSelectorContent,
//   MultiSelectorInput,
//   MultiSelectorItem,
//   MultiSelectorList,
//   MultiSelectorTrigger,
// } from '@/components/ui/multi-selector'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export const newSystemFormSchema = createSystemSchema

export type NewSystemFormValues = Infer<typeof newSystemFormSchema>

// const tags = ['d20', 'fantasy', '5e adaptation']

export function NewSystemForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'> & {}) {
  const form = useFormContext<NewSystemFormValues>()

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className="grid gap-3">
          <Label>Compatibility</Label>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="compatibility.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="compatibility.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite people</FormLabel>
                <MultiSelector onValuesChange={field.onChange} values={field.value || []}>
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Tags" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {tags.map((tag) => (
                        <MultiSelectorItem key={tag} value={tag}>
                          <span>{tag}</span>
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormItem>
            )}
          />
        </div>*/}
      </div>
    </form>
  )
}
