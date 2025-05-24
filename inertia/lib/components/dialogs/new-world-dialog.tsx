import { vineResolver } from '@hookform/resolvers/vine'
import { AlertCircle, Check, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { SystemType } from '#validators/system'

import { isValidationError } from '@/api/client'
import { useCreateWorldMutation } from '@/api/use-create-world-mutation'
import {
  NewWorldForm,
  newWorldFormSchema,
  NewWorldFormValues,
} from '@/components/forms/new-world-form'
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

export const useNewWorldDialog = () => useDialog(NewWorldDialog)

export const NewWorldDialog = registerDialog(({ systems }: { systems: SystemType[] }) => {
  const disclosure = useNewWorldDialog()

  const form = useForm<NewWorldFormValues>({
    resolver: vineResolver(newWorldFormSchema),
    defaultValues: {
      name: '',
      description: '',
      system: systems[0].id,
    },
  })

  const { mutate: createSystem, isError: isCreateSystemError, error } = useCreateWorldMutation()

  async function onSubmit(values: NewWorldFormValues) {
    createSystem(values, {
      onSuccess: () => {
        toast(<Translate t="world.dialog.new.success" />, {
          id: 'world-created',
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
            <Translate t="world.dialog.new.title" />
          </DialogTitle>

          <DialogDescription>
            <Translate t="world.dialog.new.description" />
          </DialogDescription>
        </DialogHeader>

        {isCreateSystemError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              <Translate t="world.dialog.new.error.title" />
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
          <NewWorldForm
            id="CREATE_NEW_WORLD_FORM"
            onSubmit={form.handleSubmit(onSubmit)}
            systems={systems}
          />
        </Form>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              disclosure.hide()
            }}
          >
            <Translate t="world.dialog.new.actions.cancel" />
          </Button>

          <Button form="CREATE_NEW_WORLD_FORM" type="submit">
            <Translate t="world.dialog.new.actions.submit" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export const NewWorldDialogTrigger = ({ systems }: { systems: SystemType[] }) => {
  const disclosure = useNewWorldDialog()

  return (
    <Button
      onClick={() => {
        disclosure.show({ systems })
      }}
    >
      <Plus />
      <Translate t="world.dialog.new.trigger" />
    </Button>
  )
}
