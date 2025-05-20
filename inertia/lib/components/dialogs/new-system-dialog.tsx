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
        toast('System created successfully!', {
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
          <DialogTitle>Create New System</DialogTitle>

          <DialogDescription>
            Add a new system to your Squire VTT. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        {isCreateSystemError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
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
            Cancel
          </Button>

          <Button
            form="CREATE_NEW_SYSTEM_FORM"
            type="submit"
            // onClick={() => {
            //   disclosure.hide()
            // }}
          >
            Create System
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
      Create New System
    </Button>
  )
}
