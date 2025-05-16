import React from 'react'

type ScriptProps = React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
> & {
  path: string
  enabled?: boolean
  onLoaded?: () => void
}

const ScriptLoader = ({ path, onLoaded, ...props }: Omit<ScriptProps, 'enabled'>) => {
  return <script src={path} {...props} data-id={path} />
}

const Script = ({ path, enabled = true, onLoaded, ...props }: ScriptProps) => {
  if (!enabled) {
    return null
  }

  return <ScriptLoader path={path} onLoaded={onLoaded} {...props} />
}

export { Script }
