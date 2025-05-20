import { InferPageProps } from '@adonisjs/inertia/types'
import { vineResolver } from '@hookform/resolvers/vine'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { AlertCircle, Check, GalleryVerticalEnd } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type AuthController from '#controllers/auth_controller'

import { useLoginMutation } from '@/api/useLoginMutation'
import { LoginForm } from '@/components/forms/login-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Form } from '@/components/ui/form'

type PageProps = InferPageProps<AuthController, 'loginPage'>

const formSchema = vine.compile(
  vine.object({
    username: vine.string().minLength(1).maxLength(255),
    password: vine.string().minLength(1).maxLength(255),
  })
)

export default function LoginPage({ users, world }: PageProps) {
  const { mutate: login, isError: isLoginError } = useLoginMutation(world)

  const form = useForm<Infer<typeof formSchema>>({
    resolver: vineResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: Infer<typeof formSchema>) {
    login(values, {
      onSuccess: () => {
        toast('Login successful!', {
          id: 'login-success',
          description: 'Redirecting to dashboard...',
          duration: 2000,
          icon: <Check className="size-4" />,
          dismissible: true,
        })
      },
    })
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs grid gap-6">
            {isLoginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>Invalid username or password. Please try again.</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <LoginForm onSubmit={form.handleSubmit(onSubmit)} users={users as any[]} />
            </Form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
