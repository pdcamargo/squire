import { useTranslation } from '@/hooks/use-translation'

export const Translate = ({
  fallback,
  t: tKey,
  data,
}: {
  fallback?: string
  t: string
  data?: Record<string, any>
}) => {
  const { t } = useTranslation()

  const translation = t(tKey, data, fallback)

  return <>{translation}</>
}
