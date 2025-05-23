import { vineResolver } from '@hookform/resolvers/vine'
import { AlertCircle, Check, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { isValidationError } from '@/api/client'
import { useCreateSystemMutation } from '@/api/useCreateSystemMutation'
import {
  NewSystemForm,
  newSystemFormSchema,
  NewSystemFormValues,
} from '@/components/forms/new-system-form'
import { Translate } from '@/components/translate'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { registerDialog, useDialog } from '@/hooks/use-dialog'

export const useNewSystemDialog = () => useDialog(NewSystemDialog)

export const NewSystemDialog = registerDialog(() => {
  const disclosure = useNewSystemDialog()

  const form = useForm<NewSystemFormValues>({
    resolver: vineResolver(newSystemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      compatibility: {
        min: '0.0.0',
        max: '999.9.9',
      },
    },
  })

  const { mutate: createSystem, isError: isCreateSystemError, error } = useCreateSystemMutation()

  async function onSubmit(values: NewSystemFormValues) {
    createSystem(values, {
      onSuccess: () => {
        toast(<Translate t="system.dialog.new.success" />, {
          id: 'system-created',
          duration: 5000,
          icon: <Check className="size-4" />,
          dismissible: true,
        })

        disclosure.close()
      },
    })
  }

  return (
    <Dialog open={disclosure.isVisible} onOpenChange={disclosure.hide}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Translate t="system.dialog.new.title" />
          </DialogTitle>

          <DialogDescription>
            <Translate t="system.dialog.new.description" />
          </DialogDescription>
        </DialogHeader>

        {isCreateSystemError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              <Translate t="system.dialog.new.error.title" />
            </AlertTitle>
            <AlertDescription>
              {isValidationError(error) && (
                <div className="grid gap-2">
                  {error.errors.map((validationError) => (
                    <div key={validationError.field + validationError.rule}>
                      {validationError.message}
                    </div>
                  ))}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <NewSystemForm id="CREATE_NEW_SYSTEM_FORM" onSubmit={form.handleSubmit(onSubmit)} />
        </Form>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              disclosure.hide()
            }}
          >
            <Translate t="system.dialog.new.actions.cancel" />
          </Button>

          <Button form="CREATE_NEW_SYSTEM_FORM" type="submit">
            <Translate t="system.dialog.new.actions.submit" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export const NewSystemDialogTrigger = () => {
  const disclosure = useNewSystemDialog()

  return (
    <Button
      onClick={() => {
        disclosure.show()
      }}
    >
      <Plus />
      <Translate t="system.dialog.new.trigger" />
    </Button>
  )
}
