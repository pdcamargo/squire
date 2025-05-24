import { Infer } from '@vinejs/vine/types'
import { useFormContext } from 'react-hook-form'

import { SystemType } from '#validators/system'
import { createWorldSchema } from '#validators/world'

import { Translate } from '@/components/translate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from '@/hooks/use-translation'
import { cn } from '@/lib/utils'

export const newWorldFormSchema = createWorldSchema

export type NewWorldFormValues = Infer<typeof newWorldFormSchema>

export function NewWorldForm({
  className,
  systems,
  ...props
}: React.ComponentPropsWithoutRef<'form'> & {
  systems: SystemType[]
}) {
  const { t } = useTranslation()
  const form = useFormContext<NewWorldFormValues>()

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Translate t="world.form.name.label" />
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="system"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Translate t="world.form.name.label" />
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('world.form.system.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>
                <Translate t="world.form.description.label" />
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  )
}
