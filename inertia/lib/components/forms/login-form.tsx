import { SelectValue } from '@radix-ui/react-select'
import { useFormContext } from 'react-hook-form'

import { Translate } from '@/components/translate'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectTrigger, SelectItem } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function LoginForm({
  className,
  users = [],
  ...props
}: React.ComponentPropsWithoutRef<'form'> & {
  users?: Array<{ id: number; name: string; username: string }>
}) {
  const form = useFormContext<{
    username: string
    password: string
  }>()

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          <Translate t="login.form.title" />
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          <Translate t="login.form.subtitle" />
        </p>
      </div>
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Translate t="login.form.username.label" />
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={<Translate t="login.form.username.placeholder" />} />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.username}>
                        {user.name}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Translate t="login.form.password.label" />
              </FormLabel>
              <FormControl>
                <Input type="password" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <Translate t="login.form.submit" />
        </Button>
      </div>
    </form>
  )
}
