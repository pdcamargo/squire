import { usePage } from '@inertiajs/react'
import FormatMessage from 'message-format'

export function useTranslation() {
  const page = usePage<{ locale: string; translations: Record<string, string> }>()

  function t(key: string, data?: Record<string, string>, fallback?: string): string {
    const msg = page.props.translations[key] ?? fallback ?? key

    const messageFormatter = new FormatMessage(msg, page.props.locale)

    return messageFormatter.format(data)
  }

  return {
    locale: page.props.locale,
    t,
  }
}
