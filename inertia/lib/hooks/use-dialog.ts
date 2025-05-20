import { ComponentType, FC, JSX } from 'react'

import {
  NiceModalHandler,
  useModal,
  NiceModalHocProps,
  create as createModal,
} from '@ebay/nice-modal-react'

type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
  ? Omit<React.ComponentProps<T>, 'id'>
  : Record<string, unknown>

type ModalDialogMethods<T> = {
  close: NiceModalHandler<T>['remove']
  hide: NiceModalHandler<T>['hide']
  dialogId: NiceModalHandler<T>['id']
  isVisible: NiceModalHandler<T>['visible']
}

/**
 * Function used to register modal dialogs for usage inside the app. This function allows modal dialogs to be used with `useModalDialog` hook after they have been registered.
 *
 * `useModalDialog` should only be used inside modal/sheet/sidebar components directly and in custom hook that is created for each modal.
 */
export const registerDialog = createModal as <P>(
  Comp: ComponentType<P>
) => FC<P & NiceModalHocProps>

export type CustomModalHookArguments<T> = Partial<T>

/**
 * used to conditional provide the optional args argument on the showModal and
 * updateModal functions returned by the useDialog hook
 *
 * Consider the following example:
 * if the type of componentProps is:
 * type ComponentProps = {
 *  prop1: string;
 *  prop2?: string;
 * }
 *
 * const { showModal } = useConfirmModal();
 *
 * showModal(); // invalid, since prop1 is required and does not compile
 * showModal({ prop1: "value" }); // prop1 is required and has to be passed
 *
 * however, if the type of componentProps is:
 * type ComponentProps = {
 *   prop1?: string;
 *   prop2?: string;
 * }
 *
 * const { showModal } = useConfirmModal();
 * showModal(); // should be valid, since all properties are optional
 */
type IfAllPropertiesOptional<T, AllOptional, NotAllOptional> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? true : false
}[keyof T] extends true
  ? AllOptional
  : NotAllOptional

/**
 * Hook that allows lifecycle of registered dialog to be controlled.
 */
export function useDialog<
  T extends React.FC<any>,
  ComponentProps extends NiceModalArgs<T>,
  // This type is copied from @ebay/nice-modal-react
  PreparedProps extends Partial<ComponentProps> = {} | ComponentProps,
  RemainingProps = Omit<ComponentProps, keyof PreparedProps> & Partial<ComponentProps>,
  OptionalReturnValue = IfAllPropertiesOptional<
    ComponentProps,
    (args?: RemainingProps) => void,
    (args: RemainingProps) => void
  >,
>(
  modal: T,
  args?: PreparedProps
): ModalDialogMethods<T> & {
  show: OptionalReturnValue
  update: OptionalReturnValue
} {
  const modalDialog = useModal(modal, args)

  return {
    // We use .remove to hide the modal because that unmounts the modal completely
    // Useful if there is a form inside the modal so that re-opening the modal resets it properly because it counts as first render again
    close: modalDialog.remove,
    hide: modalDialog.hide,
    dialogId: modalDialog.id,
    show: modalDialog.show as any,
    // Modal can be updated in place just by calling `.show()` again, but it's better to provide this as an alias for added clarity
    update: modalDialog.show as any,
    isVisible: modalDialog.visible,
  }
}
