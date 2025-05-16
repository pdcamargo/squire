import React, { useEffect } from 'react'

type ScriptProps = React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
> & {
  path: string
  enabled?: boolean
  onLoaded?: () => void
}

const Script: React.FC<ScriptProps> = ({ path, enabled = true, onLoaded, ...props }) => {
  useEffect(() => {
    if (!enabled) return

    const script = document.createElement('script')
    script.src = path
    script.async = true

    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined) {
        script.setAttribute(key, value as string)
      }
    })

    script.onload = () => {
      if (onLoaded) onLoaded()
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [path, enabled, onLoaded, props])

  return null
}

export default Script
